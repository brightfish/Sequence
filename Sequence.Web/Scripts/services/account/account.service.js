(function () {
    'use strict';

    var application = angular.module('Application');

    application.factory('accountService', accountService);

    accountService.$inject = ['$http', '$q'];

    function accountService($http, $q) {
        var service = {
            getSecurityQuestions: getSecurityQuestions,
            register: register,
            signIn: signIn,
            signOut: signOut,
            link: link,
            getLinkInfo: getLinkInfo,
            getUserInfo: getUserInfo,
            resetPassword: resetPassword,
            sendResetPasswordEmail: sendResetPasswordEmail,
            getUserSecurityQuestions: getUserSecurityQuestions,
            answerSecurityQuestions: answerSecurityQuestions,
            updatePersonalDetails: updatePersonalDetails,
            updateSecurityQuestions: updateSecurityQuestions,
            changePassword: changePassword
        };

        function getSecurityQuestions() {
            var securityQuestions =
            [
                { Question: 'What is your mother\'s maiden name?', Selected: false },
                { Question: 'What was the name of your first pet?', Selected: false },
                { Question: 'What was the make and model of your first car?', Selected: false },
                { Question: 'What was the name of the street where you grew up?', Selected: false },
                { Question: 'What was the last name of your favorite elementary school teacher?', Selected: false },
                { Question: 'What is your favorite children’s book?', Selected: false },
                { Question: 'In what city did your parents meet?', Selected: false },
                { Question: 'What is the country of your ultimate dream vacation?', Selected: false },
                { Question: 'Who was your favorite singer or band in high school?', Selected: false },
                { Question: 'Who was your favorite film star or character in high school?', Selected: false },
                { Question: 'What was the first name of your first boss?', Selected: false },
                { Question: 'What was the first film you saw in the theatre?', Selected: false },
                { Question: 'What was the first thing you learned how to cook?', Selected: false },
                { Question: 'Where did you go the first time you flew on a plane?', Selected: false },
                { Question: 'What is the name of the first beach you visited?', Selected: false },
                { Question: 'What was the first album that you purchased?', Selected: false },
                { Question: 'What was the name of your favorite sports team in high school?', Selected: false },
                { Question: 'What was the first concert you attended?', Selected: false },
                { Question: 'What do you want to be when you grow up?', Selected: false },
                { Question: 'What food do you absolutely hate?', Selected: false }
            ];

            return securityQuestions;
        }

        function register(user) {
            return $http.post('api/account/register', user);
        }

        function signIn(credentials) {
            return $http.post('api/account/signin', credentials);
        }

        function signOut() {
            return $http.post('api/account/signout');
        }

        function link(token) {
            return $http.post('api/account/link/{token}'.replace('{token}', token));
        }

        function getLinkInfo(token) {
            return $http.get('api/account/getlinkinfo/{token}'.replace('{token}', token));
        }

        function getUserInfo() {
            return $http.get('api/account/getuserinfo');
        }

        function sendResetPasswordEmail(email) {
            return $http.post('api/account/sendresetpasswordemail', { Email: email });
        }

        function resetPassword(model) {
            return $http.post('api/account/resetpassword', model);
        }

        function getUserSecurityQuestions(email) {
            return $http.post('api/account/getsecurityquestions', { Email: email });
        }

        function answerSecurityQuestions(model) {
            return $http.post('api/account/answersecurityquestions', model);
        }

        function updatePersonalDetails(personalDetails) {
            return $http.put('api/account/updatepersonaldetails', personalDetails);
        }

        function updateSecurityQuestions(securityQuestions) {
            return $http.put('api/account/updatesecurityquestions', securityQuestions);
        }

        function changePassword(passwordDetails) {
            return $http.put('api/account/changepassword', passwordDetails);
        }

        return service;
    }
})();