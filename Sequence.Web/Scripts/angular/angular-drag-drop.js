(function () {
    'use strict';
    //draggable
    //action='?' copy, move
    //ng-model required


    var module = angular.module('drag-drop', []);
    module.directive('draggable', ['$parse', '$timeout', 'information',
                          function ($parse, $timeout, information) {
                              return function (scope, element, attr, model) {
                                  var handle = element.find('*[handle]');
                                  if (!handle) {
                                      handle = element;
                                  }
                                  handle.attr('draggable', 'true');

                                  handle.on('dragstart', function (event) {
                                      event = event.originalEvent || event;

                                      if (element.attr('draggable') == 'false') return true;

                                      information.action = attr.action || 'move';
                                      switch (information.action) {
                                          case 'move':
                                              information.model = scope.$eval(attr.ngModel);
                                              element.addClass('moving');
                                              break;
                                          case 'copy':
                                              information.model = angular.copy(scope.$eval(attr.ngModel));
                                              element.addClass('copying');
                                              break;
                                          default:
                                              throw 'Not Implemented';
                                      }

                                      event.dataTransfer.effectAllowed = information.action;

                                      element.addClass("dragging");

                                      $timeout(function () { element.addClass("dragging-source"); }, 0);

                                      information.dropEffect = "none";
                                      information.isDragging = true;
                                      information.type = attr.type;

                                      if (event.dataTransfer.setDragImage) {
                                          event.dataTransfer.setDragImage(element[0], 0, 0);
                                      }

                                      $parse(attr.dragStart)(scope, { event: event });

                                      event.stopPropagation();
                                  });

                                  handle.on('dragend', function (event) {
                                      event = event.originalEvent || event;

                                      element.removeClass('moving');
                                      element.removeClass('copying');
                                      element.removeClass("dragging");
                                      $timeout(function () { element.removeClass("dragging-source"); }, 0);
                                      information.isDragging = false;
                                      event.stopPropagation();
                                  });
                              };
                          }]);

    module.directive('droppable', ['$parse', '$timeout', 'information',
                   function ($parse, $timeout, information) {
                       return function (scope, element, attr) {
                           var placeholder = getPlaceholderElement();
                           var placeholderNode = placeholder[0];
                           var droppableNode = element[0];
                           placeholder.remove();

                           var horizontal = attr.horizontal && scope.$eval(attr.horizontal);

                           element.on('dragenter', function (event) {
                               event = event.originalEvent || event;
                               if (!isDropAllowed(event)) {
                                   return true;
                               }

                               event.preventDefault();
                           });

                           element.on('dragover', function (event) {
                               event = event.originalEvent || event;

                               if (!isDropAllowed(event)) {
                                   return true;
                               }

                               if (placeholderNode.parentNode != droppableNode) {
                                   element.append(placeholder);
                               }

                               if (event.target !== droppableNode) {
                                   // Find the node direct directly below the list node.
                                   var listItemNode = event.target;
                                   while (listItemNode.parentNode !== droppableNode && listItemNode.parentNode) {
                                       listItemNode = listItemNode.parentNode;
                                   }

                                   if (listItemNode.parentNode === droppableNode && listItemNode !== placeholderNode) {
                                       // If the mouse pointer is in the upper half of the child element,
                                       // we place it before the child element, otherwise below it.
                                       if (isMouseInFirstHalf(event, listItemNode)) {
                                           droppableNode.insertBefore(placeholderNode, listItemNode);
                                       } else {
                                           droppableNode.insertBefore(placeholderNode, listItemNode.nextSibling);
                                       }
                                   }
                               }
                               else {

                                   if (isMouseInFirstHalf(event, placeholderNode, true)) {
                                       while (placeholderNode.previousElementSibling
                                            && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true)
                                            || placeholderNode.previousElementSibling.offsetHeight === 0)) {
                                           droppableNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
                                       }
                                   } else {
                                       while (placeholderNode.nextElementSibling &&
                                            !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                                           droppableNode.insertBefore(placeholderNode,
                                               placeholderNode.nextElementSibling.nextElementSibling);
                                       }
                                   }
                               }

                               if (attr.dragover && !invokeCallback(attr.dragover, event, getPlaceholderIndex())) {
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

                               //Prevent browser from interpreting as Url.
                               event.preventDefault();

                               // Invoke the callback, which can transform the transferredObject and even abort the drop.
                               var index = getPlaceholderIndex();
                               if (attr.ondrop) {
                                   information.model = invokeCallback(attr.ondrop, event, index, information.model);
                                   if (!information.model) {
                                       return stopDragover();
                                   }
                               }

                               // Insert the object into the array, unless dnd-drop took care of that (returned true).
                               if (information.model !== true) {
                                   scope.$apply(function () {
                                       var model = scope.$eval(attr.ngModel);
                                       switch (information.action) {
                                           case 'move':
                                               var test = model.indexOf(information.model);

                                               if (test >= 0) {
                                                   model.splice(test, 1);
                                               }
                                               break;
                                           case 'none':
                                           case 'copy':
                                               break;

                                           default:
                                               throw 'Not Implemented';
                                       }

                                       model.splice(index, 0, information.model);
                                   });
                               }

                               if (event.dataTransfer.dropEffect === "none") {
                                   if (event.dataTransfer.effectAllowed === "copy" ||
                                       event.dataTransfer.effectAllowed === "move") {
                                       information.dropEffect = event.dataTransfer.effectAllowed;
                                   } else {
                                       information.dropEffect = event.ctrlKey ? "copy" : "move";
                                   }
                               } else {
                                   information.dropEffect = event.dataTransfer.dropEffect;
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
                               return Array.prototype.indexOf.call(droppableNode.children, placeholderNode);
                           }

                           function isDropAllowed(event) {
                               if (!information.isDragging) return false;

                               if (attr.allowed && information.isDragging) {
                                   var allowed = attr.allowed;
                                   if (angular.isArray(allowed) && allowed.indexOf(information.dragType) === -1) {
                                       return false;
                                   }
                               }

                               if (scope.$eval(attr.disabled)) return false;

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
                                   external: !information.isDragging,
                                   type: information.isDragging ? information.dragType : undefined
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
                   }]);





    module.factory('information', function () { return {} });

    module.directive('selectable', function ($document) {

        var dictionary = [];

        $document.find('html').on('mousedown', function (event) {
            event = event.originalEvent || event;

            for (var type in dictionary) {
                var elements = dictionary[type];

                for (var index in elements) {
                    var target = dictionary[type][index];
                    target.removeClass('active');
                }
            }
            event.stopPropagation();
        });

        return {
            link: function (scope, element, attributes) {
                var elements = dictionary[attributes.type] = dictionary[attributes.type] ? dictionary[attributes.type] : [];
                elements.push(element);

                element.on('mousedown', function (event) {
                    for (var index in dictionary[attributes.type]) {
                        var target = dictionary[attributes.type][index];
                        target.removeClass('active');
                    }

                    element.addClass('active');
                    event.stopPropagation();
                });
            }
        }
    });

    module.directive('openable', function () {

    });
})();