(function () {
    var module = angular.module('drag-drop', []);
    module.directive('draggable', ['$parse', '$timeout', 'dndDropEffectWorkaround', 'dndDragTypeWorkaround',
                          function ($parse, $timeout, dndDropEffectWorkaround, dndDragTypeWorkaround) {
                              return function (scope, element, attr, model) {
                                  element.attr("draggable", "true");

                                  if (attr.disabled) {
                                      scope.$watch(attr.disabled, function (disabled) {
                                          element.attr("draggable", !disabled);
                                      });
                                  }

                                  element.on('dragstart', function (event) {
                                      event = event.originalEvent || event;

                                      if (element.attr('draggable') == 'false') return true;

                                      event.dataTransfer.setData("Text", angular.toJson(scope.$eval(attr.ngModel)));

                                      event.dataTransfer.effectAllowed = attr.dndEffectAllowed || "move";

                                      element.addClass("dragging");
                                      $timeout(function () { element.addClass("dragging-source"); }, 0);

                                      dndDropEffectWorkaround.dropEffect = "none";
                                      dndDragTypeWorkaround.isDragging = true;

                                      dndDragTypeWorkaround.dragType = attr.dndType ? scope.$eval(attr.dndType) : undefined;

                                      if (event._dndHandle && event.dataTransfer.setDragImage) {
                                          event.dataTransfer.setDragImage(element[0], 0, 0);
                                      }

                                      $parse(attr.dragStart)(scope, { event: event });

                                      event.stopPropagation();
                                  });


                                  element.on('dragend', function (event) {
                                      event = event.originalEvent || event;

                                      var dropEffect = dndDropEffectWorkaround.dropEffect;
                                      scope.$apply(function () {
                                          switch (dropEffect) {
                                              case "move":
                                                  $parse(attr.dndMoved)(scope, { event: event });
                                                  break;
                                              case "copy":
                                                  $parse(attr.dndCopied)(scope, { event: event });
                                                  break;
                                              case "none":
                                                  $parse(attr.dndCanceled)(scope, { event: event });
                                                  break;
                                          }
                                          $parse(attr.dndDragend)(scope, { event: event, dropEffect: dropEffect });
                                      });

                                      element.removeClass("dragging");
                                      $timeout(function () { element.removeClass("dndDraggingSource"); }, 0);
                                      dndDragTypeWorkaround.isDragging = false;
                                      event.stopPropagation();
                                  });

                                  element.on('click', function (event) {
                                      if (!attr.dndSelected) return;

                                      event = event.originalEvent || event;
                                      scope.$apply(function () {
                                          $parse(attr.dndSelected)(scope, { event: event });
                                      });

                                      // Prevent triggering dndSelected in parent elements.
                                      event.stopPropagation();
                                  });


                                  element.on('selectstart', function () {
                                      if (this.dragDrop) this.dragDrop();
                                  });
                              };
                          }])

    module.directive('droppable', ['$parse', '$timeout', 'dndDropEffectWorkaround', 'dndDragTypeWorkaround',
                   function ($parse, $timeout, dndDropEffectWorkaround, dndDragTypeWorkaround) {
                       return function (scope, element, attr) {
                           var placeholder = getPlaceholderElement();
                           var placeholderNode = placeholder[0];
                           var listNode = element[0];
                           placeholder.remove();

                           var horizontal = attr.dndHorizontalList && scope.$eval(attr.dndHorizontalList);
                           var externalSources = attr.dndExternalSources && scope.$eval(attr.dndExternalSources);

                           element.on('dragenter', function (event) {
                               event = event.originalEvent || event;
                               if (!isDropAllowed(event)) return true;
                               event.preventDefault();
                           });

                           element.on('dragover', function (event) {
                               event = event.originalEvent || event;

                               if (!isDropAllowed(event)) return true;

                               // First of all, make sure that the placeholder is shown
                               // This is especially important if the list is empty
                               if (placeholderNode.parentNode != listNode) {
                                   element.append(placeholder);
                               }

                               if (event.target !== listNode) {
                                   // Try to find the node direct directly below the list node.
                                   var listItemNode = event.target;
                                   while (listItemNode.parentNode !== listNode && listItemNode.parentNode) {
                                       listItemNode = listItemNode.parentNode;
                                   }

                                   if (listItemNode.parentNode === listNode && listItemNode !== placeholderNode) {
                                       // If the mouse pointer is in the upper half of the child element,
                                       // we place it before the child element, otherwise below it.
                                       if (isMouseInFirstHalf(event, listItemNode)) {
                                           listNode.insertBefore(placeholderNode, listItemNode);
                                       } else {
                                           listNode.insertBefore(placeholderNode, listItemNode.nextSibling);
                                       }
                                   }
                               } else {

                                   if (isMouseInFirstHalf(event, placeholderNode, true)) {
                                       while (placeholderNode.previousElementSibling
                                            && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true)
                                            || placeholderNode.previousElementSibling.offsetHeight === 0)) {
                                           listNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
                                       }
                                   } else {
                                       while (placeholderNode.nextElementSibling &&
                                            !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                                           listNode.insertBefore(placeholderNode,
                                               placeholderNode.nextElementSibling.nextElementSibling);
                                       }
                                   }
                               }

                               if (attr.dndDragover && !invokeCallback(attr.dndDragover, event, getPlaceholderIndex())) {
                                   return stopDragover();
                               }

                               element.addClass("dragover");
                               event.preventDefault();
                               event.stopPropagation();
                               return false;
                           });

                           element.on('drop', function (event) {
                               event = event.originalEvent || event;

                               if (!isDropAllowed(event)) return true;

                               // The default behavior in Firefox is to interpret the dropped element as URL and
                               // forward to it. We want to prevent that even if our drop is aborted.
                               event.preventDefault();

                               // Unserialize the data that was serialized in dragstart. According to the HTML5 specs,
                               // the "Text" drag type will be converted to text/plain, but IE does not do that.
                               var data = event.dataTransfer.getData("Text") || event.dataTransfer.getData("text/plain");
                               var transferredObject;
                               try {
                                   transferredObject = JSON.parse(data);
                               } catch (e) {
                                   return stopDragover();
                               }

                               // Invoke the callback, which can transform the transferredObject and even abort the drop.
                               var index = getPlaceholderIndex();
                               if (attr.dndDrop) {
                                   transferredObject = invokeCallback(attr.dndDrop, event, index, transferredObject);
                                   if (!transferredObject) {
                                       return stopDragover();
                                   }
                               }

                               // Insert the object into the array, unless dnd-drop took care of that (returned true).
                               if (transferredObject !== true) {
                                   scope.$apply(function () {
                                       scope.$eval(attr.ngModel).splice(index, 0, transferredObject);
                                   });
                               }
                               invokeCallback(attr.dndInserted, event, index, transferredObject);

                               // In Chrome on Windows the dropEffect will always be none...
                               // We have to determine the actual effect manually from the allowed effects
                               if (event.dataTransfer.dropEffect === "none") {
                                   if (event.dataTransfer.effectAllowed === "copy" ||
                                       event.dataTransfer.effectAllowed === "move") {
                                       dndDropEffectWorkaround.dropEffect = event.dataTransfer.effectAllowed;
                                   } else {
                                       dndDropEffectWorkaround.dropEffect = event.ctrlKey ? "copy" : "move";
                                   }
                               } else {
                                   dndDropEffectWorkaround.dropEffect = event.dataTransfer.dropEffect;
                               }

                               stopDragover();
                               event.stopPropagation();
                               return false;
                           });

                           element.on('dragleave', function (event) {
                               event = event.originalEvent || event;

                               element.removeClass("dragover");
                               $timeout(function () {
                                   if (!element.hasClass("dragover")) {
                                       placeholder.remove();
                                   }
                               }, 100);
                           });

                           function isMouseInFirstHalf(event, targetNode, relativeToParent) {
                               var mousePointer = horizontal ? (event.offsetX || event.layerX)
                                                             : (event.offsetY || event.layerY);
                               var targetSize = horizontal ? targetNode.offsetWidth : targetNode.offsetHeight;
                               var targetPosition = horizontal ? targetNode.offsetLeft : targetNode.offsetTop;
                               targetPosition = relativeToParent ? targetPosition : 0;
                               return mousePointer < targetPosition + targetSize / 2;
                           }

                           function getPlaceholderElement() {
                               var placeholder = element.find('*[placeholder]');
                               return placeholder || angular.element("<li placeholder></li>");
                           }

                           function getPlaceholderIndex() {
                               return Array.prototype.indexOf.call(listNode.children, placeholderNode);
                           }

                           function isDropAllowed(event) {
                               if (!dndDragTypeWorkaround.isDragging && !externalSources) return false;

                               if (!hasTextMimetype(event.dataTransfer.types)) return false;

                               if (attr.dndAllowedTypes && dndDragTypeWorkaround.isDragging) {
                                   var allowed = scope.$eval(attr.dndAllowedTypes);
                                   if (angular.isArray(allowed) && allowed.indexOf(dndDragTypeWorkaround.dragType) === -1) {
                                       return false;
                                   }
                               }

                               if (attr.dndDisableIf && scope.$eval(attr.dndDisableIf)) return false;

                               return true;
                           }

                           function stopDragover() {
                               placeholder.remove();
                               element.removeClass("dragover");
                               return true;
                           }

                           function invokeCallback(expression, event, index, item) {
                               return $parse(expression)(scope, {
                                   event: event,
                                   index: index,
                                   item: item || undefined,
                                   external: !dndDragTypeWorkaround.isDragging,
                                   type: dndDragTypeWorkaround.isDragging ? dndDragTypeWorkaround.dragType : undefined
                               });
                           }

                           function hasTextMimetype(types) {
                               if (!types) return true;
                               for (var i = 0; i < types.length; i++) {
                                   if (types[i] === "Text" || types[i] === "text/plain") return true;
                               }

                               return false;
                           }
                       };
                   }])

    module.directive('noDrag', function () {
        return function (scope, element, attr) {
            element.attr("draggable", "true");

            element.on('dragstart', function (event) {
                event = event.originalEvent || event;

                if (!event._dndHandle) {
                    if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
                        event.preventDefault();
                    }
                    event.stopPropagation();
                }
            });

            element.on('dragend', function (event) {
                event = event.originalEvent || event;
                if (!event._dndHandle) {
                    event.stopPropagation();
                }
            });
        };
    })

    module.directive('handle', function () {
        return function (scope, element, attr) {
            element.attr("draggable", "true");
            element.addClass('handle');
            element.on('dragstart dragend', function (event) {
                event = event.originalEvent || event;
                event._dndHandle = true;
            });
        };
    })


    module.factory('dndDragTypeWorkaround', function () { return {} })


    module.factory('dndDropEffectWorkaround', function () { return {} });

})();