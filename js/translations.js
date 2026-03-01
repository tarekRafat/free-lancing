"use strict";
/* global $ */ // let TypeScript know `$` is provided globally by jQuery
var translations = {};
function getI18nBasePath() {
    // when hosted under GitHub Pages the root of the repo is included in
    // the path.  `../i18n` works from /login/ pages but fails from the
    // root; otherwise `./i18n` is fine.
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf("/login/") !== -1) {
        return "../i18n/";
    }
    return "./i18n/";
}
function loadLanguage(lang) {
    var url = getI18nBasePath() + "".concat(lang, ".json");
    console.debug("loading language file", url);
    return $.getJSON(url)
        .done(function (data) {
        translations[lang] = data;
    })
        .fail(function (jqxhr, textStatus, error) {
        console.error("failed to load language file", url, textStatus, error);
    });
}
function applyTranslations(lang) {
    var dict = translations[lang] || {};
    $("[data-i18n]").each(function () {
        var key = $(this).data("i18n");
        if (dict[key] !== undefined) {
            $(this).text(dict[key]);
        }
        else {
            console.warn("missing translation", lang, key);
        }
    });
    $("[data-i18n-placeholder]").each(function () {
        var key = $(this).data("i18n-placeholder");
        if (dict[key] !== undefined) {
            $(this).attr("placeholder", dict[key]);
        }
        else {
            console.warn("missing translation (placeholder)", lang, key);
        }
    });
    if (dict["header.login"] !== undefined) {
        $("#header-login-btn").text(dict["header.login"]);
    }
    $("#language-btn p").text(dict["header.language"] || $("#language-btn p").text());
    $("html").attr("lang", lang);
    if (lang === "ar") {
        $("html").attr("dir", "rtl");
    }
    else {
        $("html").removeAttr("dir");
    }
}
$(function () {
    // default language is Arabic
    var currentLang = "ar";
    // load both languages, then apply (ensure button text updated too)
    $.when(loadLanguage("en"), loadLanguage("ar")).then(function () {
        applyTranslations(currentLang);
    });
    $("#language-btn").on("click", function () {
        currentLang = currentLang === "en" ? "ar" : "en";
        applyTranslations(currentLang);
    });
    $("#login-form").on("submit", function (e) {
        e.preventDefault();
        var user = $("#username").val();
        var pass = $("#password").val();
        if (user && pass) {
            alert(translations[currentLang]["login.submit"] + " " + user);
        }
        else {
            alert(currentLang === "en" ? "Please fill in both fields" : "يرجى ملء الحقول");
        }
    });
});
