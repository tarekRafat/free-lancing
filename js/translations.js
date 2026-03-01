"use strict";
/* global $ */ // let TypeScript know `$` is provided globally by jQuery
var translations = {};
function loadLanguage(lang) {
    return $.getJSON("../i18n/".concat(lang, ".json")).done(function (data) {
        translations[lang] = data;
    });
}
function applyTranslations(lang) {
    $("[data-i18n]").each(function () {
        var key = $(this).data("i18n");
        $(this).text(translations[lang][key]);
    });
    $("[data-i18n-placeholder]").each(function () {
        var key = $(this).data("i18n-placeholder");
        $(this).attr("placeholder", translations[lang][key]);
    });
    $("#header-login-btn").text(translations[lang]["header.login"]);
    console.log($("#language-btn").text());
    $("#language-btn p").text(translations[lang]["header.language"]);
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
