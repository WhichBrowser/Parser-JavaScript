#### 0.5.1 (2019-11-30)
* **Database:**  Added Chrome 77 and 78. 

#### 0.5.0 (2019-08-25)
* **Database:** Added support for Chromium based Edge. Updated Android and iOS models. Added Chrome 75 and 76. Added Samsung Galaxy Fold and Galaxy A models.
* **Fixes:** False positive for Obigo browser. 

#### 0.4.2 (2019-06-01)
Now *TypeScript Types* are available thanks to @[AnandChowdhary](https://github.com/AnandChowdhary) and his PR [#36](https://github.com/WhichBrowser/Parser-JavaScript/pull/36) 
* **Database:** Added Chrome 73 and 74 ([d2ea800](https://github.com/WhichBrowser/Parser-JavaScript/commit/d2ea8009277426ea874559e8e426f29510816ae0))

#### 0.4.0 (2019-02-07)
* **Fix:** [Issue 96 of WhichBrowser/Parser-PHP](https://github.com/WhichBrowser/Parser-PHP/issues/96), `profiles.js` and `models-*.js` files had some occourrences of spaces replaced by Unicode Character 'EN SPACE' (U+2002). The scripts that download these files are now stripping away that character and replacing it with a normal space. Thanks @[koconder](https://github.com/koconder) for [#29](https://github.com/WhichBrowser/Parser-JavaScript/pull/29) and @[Taiwaninja](https://github.com/Taiwaninja) for reporting it.
* **Tools:** WhichBrowser/Parser-Javascript is now tested on all the node versions between 6 and 11 included. Thanks again to @[koconder](https://github.com/koconder) for [#30](https://github.com/WhichBrowser/Parser-JavaScript/pull/30).
* **Database:** Added Chrome 70, 71 and 72 ([34735c2](https://github.com/WhichBrowser/Parser-JavaScript/commit/34735c27191e6b4c70b850aeea6f90bc51c65299))

#### 0.3.5 (2018-10-01)
* **Database:** Added new iPhones XS, XS Max, XR ([911ae7a](https://github.com/WhichBrowser/Parser-JavaScript/commit/911ae7a7847acc2be01a809db95bbfaeb930ae73))

#### 0.3.4 (2018-09-13)
* **Database:** Added Chrome 69 ([5b8a4fa](https://github.com/WhichBrowser/Parser-JavaScript/commit/5b8a4fa5e81740336cf29c88982af152f70e81c9))

#### 0.3.3 (2018-08-22)
* **Fixes:** Now is possible to *really* disable the bot detection with the option `detectBots: false` ([5e02e9a](https://github.com/WhichBrowser/Parser-JavaScript/commit/5e02e9a01fdee83b7bb0b6e91372b1870b157d52))

#### 0.3.2 (2018-07-27)
* **Database:** Added Chrome 68 ([0d04c8d](https://github.com/WhichBrowser/Parser-JavaScript/commit/0d04c8def9971c7a6bf16e1b1398bb475e69a310) & [cd5ec81](https://github.com/WhichBrowser/Parser-JavaScript/commit/cd5ec8183a6145dd901e3433c78846e1f9af5976))
* **Database:** Fixed name of Oculus Browser and added Oculus Go detection, thanks @frankolivier (#23) ([b38377c](https://github.com/WhichBrowser/Parser-JavaScript/commit/b38377c8d1856a316c6f74fea15ee3228aa050d6))

#### 0.3.1 (2018-07-13)
* **Database:** Updated Models, Indices and Profiles ([fa4dd85](https://github.com/WhichBrowser/Parser-JavaScript/commit/fa4dd8514991578da4102027269071db860194f3))

#### 0.3.0 (2018-06-19)
* **Database:** Added Chrome 66 & 67 ([a9bce87](https://github.com/WhichBrowser/Parser-JavaScript/commit/a9bce872a9a17491539aca760d2627f1af2a6beb))

#### 0.2.9 (2018-03-16)
* **Database:** Added Chrome 65 ([c1c9148](https://github.com/WhichBrowser/Parser-JavaScript/commit/c1c9148397b179d0655ec0f5b181d8e65511df38))

#### 0.2.8 (2018-03-06)
* **Fixes:** Update dependencies due to [vulnerable moment.js version](https://nvd.nist.gov/vuln/detail/CVE-2017-18214)  ([4ed2fc2](https://github.com/WhichBrowser/Parser-JavaScript/commit/4ed2fc296e1949b0cb8c5563a65b8cf97649241a))
* **Database:** Added Czech service, thanks to @pixietrixibell for [#90 on Parser-PHP](https://github.com/WhichBrowser/Parser-PHP/pull/90) ([8a96017](https://github.com/WhichBrowser/Parser-JavaScript/commit/8a96017408ac35b37e73d31b7746ad84723dcfc0))

#### 0.2.7 (2018-01-31)
* **Fixes:** Windows IoT 10 being detected as Android ([695751b](https://github.com/WhichBrowser/Parser-JavaScript/commit/695751b00a28b6ca28208c944e8bbf13a230c798))
* **Database:** Added Chrome 64 ([ec0e117](https://github.com/WhichBrowser/Parser-JavaScript/commit/ec0e117b7e1f56a68d53cc2e8d0982b23827994a))

#### 0.2.6 (2018-01-21)
**This update is too big to list all the improvements** 
Just to list some of these:

* Improved XIAOMI and MIUI browser detection
* Added Zen, Ziox, Yuanda and many others
* Added a lot of new models
* Added new browsers

#### 0.2.5 (2017-12-07)
* **Fixes:** 
    * Issue [#10](https://github.com/WhichBrowser/Parser-JavaScript/issues/10) - Thanks [@stouf](https://github.com/stouf) for reporting ([a3285e1](https://github.com/WhichBrowser/Parser-JavaScript/commit/a3285e1f1f439bccbbe2c1bb93abfdcd3a93f7de))
* **Database:** Added Chrome 63, new iPhones, MANY new models of various manufacturers and Os ([6e6715e](https://github.com/WhichBrowser/Parser-JavaScript/commit/6e6715e022bb26e2a4bd5a7f24a6fc2a9a023ebb))
* **Analysis:** Better management of Edge, added management of KaiOS ([22a2752](https://github.com/WhichBrowser/Parser-JavaScript/commit/22a27520ce38dd5f50954387b5e0499c88bef1e0))

#### 0.2.4 (2017-11-17) 
* **Database:** Added Chrome 62 ([3d4a74c](https://github.com/WhichBrowser/Parser-JavaScript/commit/3d4a74c1cf995a41bde6a6136bfd076d9e877286))

#### 0.2.3 (2017-09-25) 
* **Database:** Added Chrome 61 ([6d86594](https://github.com/WhichBrowser/Parser-JavaScript/commit/6d86594e82e795fb1720dfc162c002e73889be4b))
* **Database:** Added macOS High Sierra ([5b8584a](https://github.com/WhichBrowser/Parser-JavaScript/commit/5b8584adf81f449b75d851c34d2d6ab39d138579))

#### 0.2.2 (2017-08-08)

##### New Features
* **Database:** Added Chrome 60 ([0043804](https://github.com/WhichBrowser/Parser-JavaScript/commit/00438049ff3f30fb2810a980c88146b2112eff0b))

#### 0.2.1 (2017-07-14)

##### News
* **This project:** 🎊 is now the official JavaScript version of WhichBrowser 🍾

##### Documentation Changes
* **readme:** updated with new badge due to change of GitHub url ([11b18b7](https://github.com/WhichBrowser/Parser-JavaScript/commit/11b18b76409edeece95a8fd32fdb13b466ab1e8f))
* **changelog:** added this changelog

##### New Features
* **database:** updated with new devices ([0e9f5ff](https://github.com/WhichBrowser/Parser-JavaScript/commit/0e9f5ffe6c8c571edec13d9590c67348247a8bc1))
([a9ed8a0](https://github.com/WhichBrowser/Parser-JavaScript/commit/a9ed8a0a45206eae7a64f8f86f861688b4ed3cca))
([cd4e0cd](https://github.com/WhichBrowser/Parser-JavaScript/commit/cd4e0cd158a897a917593e41cddd992b9325b53e))
([3fbe24d](https://github.com/WhichBrowser/Parser-JavaScript/commit/3fbe24d223eb45d3fd14e97e91f55ef5f98be065))

##### Bug Fixes
* **coverage:** removed unused line of code that lowered the coverage, now is 100% 🎉 ([36fed88](https://github.com/WhichBrowser/Parser-JavaScript/commit/36fed88210cbfd38f65911a03d1d90be6e3553c4))

## 0.2.0 (2017-07-10)

##### Documentation Changes

* **readme:** added instructions 📖 on how to use cache ([0e2c83e](https://github.com/WhichBrowser/Parser-JavaScript/commit/0e2c83e5cd53bcaa5c59047ea8665a9e48174ff8))

##### New Features
* **cache:** adding a simple cache mechanism ([0e2c83e](https://github.com/WhichBrowser/Parser-JavaScript/commit/0e2c83e5cd53bcaa5c59047ea8665a9e48174ff8))

## 0.1.0 (2017-07-06)

##### New Features

* **npm:** First version of JavaScript porting on npm 🎇
