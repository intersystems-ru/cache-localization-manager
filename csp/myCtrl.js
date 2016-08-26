
app.controller("myCtrl", function($scope, $http, notifications, $filter, fileUpload) {



	var init = function () {

		$scope.url = "http://localhost:57772/clm";
		$scope.selectedLanguage = "en";
		$scope.yandexLanguagesList = {
			az: "Azeri",
			en: "English",
			ar: "Arabian",
			hy: "Armenian",
			be: "Belarusian", 
			bg: "Bulgarian",
			hu: "Hungarian",
			el: "Greek",
			ka: "Georgian",
			he: "Hebrew",
			es: "Spanish",
			it: "Italian",
			kk: "Kazakh",
			ca: "Catalan",
			lv: "Latvian",
			lt: "Lithuanian",
			de: "German",
			nl: "Dutch",
			pl: "Polish",
			pt: "Portuguese Brazil",
			ro: "Romanian",
			ru: "Russian",
			sr: "Serbian",
			sk: "Slovak",
			tr: "Turkish",
			uk: "Ukrainian",
			fi: "Finnish",
			fr: "French",
			hr: "Croatian",
			cs: "Czech",
			et: "Estonian"
		};
		$scope.getDomains();
		if ($scope.domains){
			$scope.domain = $scope.domains[0];
		}
	};

// start of getters - http get functions
	$scope.getDomains = function () {
		$http.get($scope.url + '/domains').
		then(function (response) {
			$scope.domains = response.data;
		}, function myError(response){
			notifications.showError({
				message: 'domains weren\'t downloaded',
				hideDelay: 1500,
				hide: true});
		});
	};

	$scope.getMessages = function (domain, language) {
		$http.get($scope.url + '/messages?domain=' + domain + '&language=' + language + '&spellcheck=false').
		then(function (response) {
			$scope.messages = response.data
		}, function myError(response){
			notifications.showError({
				message: 'messages weren\'t downloaded',
				hideDelay: 1500,
				hide: true});
		});
	};

	$scope.getMistakes = function () {
		$http.get(encodeURI($scope.url + '/messages?domain=' + $scope.domain + '&language=' + $scope.selectedLanguage + '&spellcheck=true')).
		then(function (response) {
		}, function myError(response){
			notifications.showError({
				message: 'mistakes weren\'t downloaded',
				hideDelay: 1500,
				hide: true});
		});
	}

	$scope.getNamespaces = function () {
		$http.get(encodeURI($scope.url + '/namespaces')).
		then(function (response) {
			$scope.namespaces = response.data.namespace;
		}, function myError(response){
			notifications.showError({
				message: 'namespaces weren\'t downloaded',
				hideDelay: 1500,
				hide: true});
		});
	}

	$scope.exportMessages = function () {
		$http.get(encodeURI($scope.url + '/export/' + $scope.domain + '/' + $scope.selectedLanguage)).
		then(function (response) {
			location.href = encodeURI($scope.url + '/export/' + $scope.domain + '/' + $scope.selectedLanguage); 
		}, function myError(response){
			notifications.showError({
				message: 'Wasn\'t possible to export messages.',
				hideDelay: 1500,
				hide: true});
		});
	};

// end of getters - http get functions

// start of http post/put functions

	$scope.postAddNewLocalization = function (domain, languageFrom, languageTo) {

		$http.post($scope.url +  '/add-new-localization?domain=' + domain + "&from=" + languageFrom + '&to=' + languageTo).
		then(function (response) {
			notifications.showSuccess({
				message: $scope.yandexLanguagesList[languageTo] + ' was successfully added to ' + domain + ' domain!',
				hideDelay: 1500,
				hide: true});
			$scope.getDomains();
			$scope.domainClicked(domain, languageTo);
			$scope.language = languageTo;
		}, function myError(response){
			notifications.showError({
				message: 'New Localization Was Not Added.',
				hideDelay: 1500,
				hide: true});
		});
	};

	$scope.putUpdateMessage = function (domain, language, id, text) {
		$http.put(encodeURI($scope.url + '/messages?domain=' + domain + '&language=' + language + '&id=' + id + '&text=' + text)).
		then(function (response) {
			notifications.showSuccess({
				message: text + ' was successfully replaced into ' + domain + ' domain!',
				hideDelay: 1500,
				hide: true});
		}, function myError(response){
			notifications.showError({
				message: 'message was not updated.',
				hideDelay: 1500,
				hide: true});
		});
	};

	$scope.uploadFile = function(){
		var file = $scope.myFile;

		console.dir(file);

		var uploadUrl = $scope.url + "/import";
		fileUpload.uploadFileToUrl(file, uploadUrl);
	};

// end of http post/put functions


// start of clicks listeners

	$scope.domainClicked = function (domain, language) {
		$scope.domain = domain;
		$scope.selectedLanguage = language;
		$scope.getMessages(domain, language);
	};

	$scope.addNewLocalizationClicked = function () {
		$scope.selectedLanguage = 'en';
		$('.ui.modal.addNewLocalization').modal('show');
	};

	$scope.changeNamespaceClicked = function () {
		$scope.getNamespaces();
		$('.ui.modal.changeNamespace').modal('show');
	};

	$scope.keyPressed = function (event, text, id) {
		if (event.keyCode == '13') {
			event.preventDefault();
			document.activeElement.blur();
		}
	};

	$scope.importMessagesClicked = function () {
		$('.ui.modal.importMessages').modal('show');
	};

// end of clicks listeners


	$scope.updateMessage = function (event, text, id) {
		if (text !== event.target.textContent){
			$scope.putUpdateMessage($scope.domain, 'en', id, event.target.textContent);
		}
	};

	$scope.setLanguage = function (language) {
		$scope.selectedLanguage = language;
		$scope.getMessages($scope.domain, language);
	};

	$scope.changeNamespace = function (selectedNamespace) {
		$http.post($scope.url +  '/namespace/' + selectedNamespace).
		then(function (response) {
			notifications.showSuccess({
				message: 'namespaces has been changed to ' + selectedNamespace,
				hideDelay: 1500,
				hide: true});
			$scope.getDomains();
			$scope.domainClicked(domain, selectedLanguage);
			$scope.language = selectedLanguage;
		}, function myError(response){
			notifications.showError({
				message: 'Namespace was not changed.',
				hideDelay: 1500,
				hide: true});
		});
	};

	init();


});