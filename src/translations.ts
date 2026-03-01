/* global $ */ // let TypeScript know `$` is provided globally by jQuery

interface TranslationMap {
  [key: string]: string;
}

const translations: Record<string, TranslationMap> = {};

function loadLanguage(lang: string): JQuery.jqXHR {
  return $.getJSON(`../i18n/${lang}.json`).done((data: TranslationMap) => {
    translations[lang] = data;
  });
}

function applyTranslations(lang: string): void {
  $("[data-i18n]").each(function () {
    const key = $(this).data("i18n") as string;
    $(this).text(translations[lang][key]);
  });
  $("[data-i18n-placeholder]").each(function () {
    const key = $(this).data("i18n-placeholder") as string;
    $(this).attr("placeholder", translations[lang][key]);
  });
  $("#header-login-btn").text(translations[lang]["header.login"]);
  console.log($("#language-btn").text());
  $("#language-btn p").text(translations[lang]["header.language"]);
  $("html").attr("lang", lang);
  if (lang === "ar") {
    $("html").attr("dir", "rtl");
  } else {
    $("html").removeAttr("dir");
  }
}

$(function () {
  // default language is Arabic
  let currentLang = "ar";

  // load both languages, then apply (ensure button text updated too)
  $.when(loadLanguage("en"), loadLanguage("ar")).then(() => {
    applyTranslations(currentLang);
  });

  $("#language-btn").on("click", function () {
    currentLang = currentLang === "en" ? "ar" : "en";
    applyTranslations(currentLang);
  });

  $("#login-form").on("submit", function (e) {
    e.preventDefault();
    const user = $("#username").val() as string;
    const pass = $("#password").val() as string;
    if (user && pass) {
      alert(translations[currentLang]["login.submit"] + " " + user);
    } else {
      alert(
        currentLang === "en" ? "Please fill in both fields" : "يرجى ملء الحقول",
      );
    }
  });
});
