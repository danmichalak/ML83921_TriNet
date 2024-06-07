"use strict";

var xmplOnReady = function() {
    var xmpControllerDriverVar = new xmpControllerDriver($("[ng-controller='XMPAnonymousPage']"));
    xmpControllerDriverVar.ready(function() {

        // load in global variables
        xmpControllerDriverVar.scope.$parent.getJson("json/global.json", function(response) {

            var globalVars = response.data;

            xmpControllerDriverVar.scope.$parent.setUrlCode();

            Object.keys(globalVars).forEach(function(key) {
                xmpControllerDriverVar.scope[key] = globalVars[key];
            });

            //xmpControllerDriverVar.scope.general_vars.disclaimer_notes = "templates/marketing/life_disclaimer_notes.html";
            xmpControllerDriverVar.scope.general_vars.disclaimer_legal = "templates/marketing/marketing_disclaimer_legal.html";


            xmpControllerDriverVar.scope.calcVars = {
                "age": "",
                "amount": "",
                "benefit_duration": "",
                "elimination_period": "",
            };

            xmpControllerDriverVar.scope.amtMin = 500;
            xmpControllerDriverVar.scope.amtMax = 5000;
            xmpControllerDriverVar.scope.amtInc = 50

            xmpControllerDriverVar.scope.salaryDisplay = "";
            xmpControllerDriverVar.scope.disSalaryBenefitMax = 0;

            xmpControllerDriverVar.scope.updateVals = function() {

                xmpControllerDriverVar.scope.resetRate();

                xmpControllerDriverVar.scope.amtMax = 5000;
                let amtVal = 0;

                if (xmpControllerDriverVar.scope.calcVars.amount) {
                    amtVal = parseInt(xmpControllerDriverVar.scope.calcVars.amount);
                }

                if (xmpControllerDriverVar.scope.disSalaryBenefitMax && (xmpControllerDriverVar.scope.amtMax > xmpControllerDriverVar.scope.disSalaryBenefitMax)) {
                    xmpControllerDriverVar.scope.amtMax = xmpControllerDriverVar.scope.disSalaryBenefitMax;
                }

                if (amtVal && (amtVal > xmpControllerDriverVar.scope.amtMax)) {
                    xmpControllerDriverVar.scope.calcVars.amount = xmpControllerDriverVar.scope.amtMax;
                }

            };

            xmpControllerDriverVar.scope.resetRate = function() {
                xmpControllerDriverVar.scope.showRates = false;

                xmpControllerDriverVar.scope.calcRate = {};
                xmpControllerDriverVar.scope.calcRate.base = {
                    "payroll_deduct": 0,
                    "direct_bill": 0
                };
                xmpControllerDriverVar.scope.calcRate.monthly = {
                    "payroll_deduct": 0,
                    "direct_bill": 0
                };
                xmpControllerDriverVar.scope.calcRate.annual = {
                    "payroll_deduct": 0,
                    "direct_bill": 0
                };

            };

            xmpControllerDriverVar.scope.formatSalary = function() {
                var salaryInput = xmpControllerDriverVar.scope.salaryDisplay;

                if (!salaryInput) {
                    salaryInput = $("#salary_display").val();
                }

                if (!salaryInput) {
                    salaryInput = "";
                }

                var salaryTrimmed = salaryInput.replace(/[^0-9]/g, "");
                var salaryAdjusted = parseInt(salaryTrimmed) + "";

                var salaryFormatted = "";

                if (salaryAdjusted && salaryAdjusted !== "NaN") {

                    salaryFormatted += "$";

                    var salaryDigits = salaryAdjusted.split("");

                    for (var i = 0; i < salaryDigits.length; i++) {
                        var r = (salaryDigits.length - i) % 3;
                        if (i > 0 && r === 0) {
                            salaryFormatted += ",";
                        }

                        salaryFormatted += salaryDigits[i];
                    }
                }

                xmpControllerDriverVar.scope.salaryDisplay = salaryFormatted;
                $("#salary_display").val(xmpControllerDriverVar.scope.salaryDisplay);

                xmpControllerDriverVar.scope.checkSalary();

            };

            xmpControllerDriverVar.scope.checkSalary = function() {

                xmpControllerDriverVar.scope.disSalaryBenefitMax = 0;

                var salaryInput = xmpControllerDriverVar.scope.salaryDisplay;

                if (!salaryInput) {
                    salaryInput = $("#salary_display").val();
                }

                if (!salaryInput) {
                    salaryInput = "";
                }

                if (salaryInput) {

                    var salaryTrimmed = salaryInput.replace(/[^0-9]/g, "");

                    if (salaryTrimmed) {

                        let salaryNum = parseInt(salaryTrimmed);

                        let maxBenefit = (salaryNum / 12) * 0.6;

                        xmpControllerDriverVar.scope.disSalaryBenefitMax = Math.floor(maxBenefit / 500) * 500;

                        if (xmpControllerDriverVar.scope.disSalaryBenefitMax > 5000) {
                            xmpControllerDriverVar.scope.disSalaryBenefitMax = 5000;
                        } else if (xmpControllerDriverVar.scope.disSalaryBenefitMax < 500) {
                            xmpControllerDriverVar.scope.disSalaryBenefitMax = 500;
                        }

                    }

                }

                xmpControllerDriverVar.scope.updateVals();

            };

            xmpControllerDriverVar.scope.calcSubmit = function() {

                xmpControllerDriverVar.scope.resetRate();

                let calcObj = xmpControllerDriverVar.scope.calcVars;
                let amount = 0;

                if (calcObj.amount) {
                    amount = parseInt(calcObj.amount);
                }

                xmpControllerDriverVar.scope.$parent.getJson("json/disability.json", function(calcResponse) {
                    let calcData = calcResponse.data;

                    let rateObj = {
                        "monthly": {},
                        "annual": {}
                    };

                    rateObj.base = xmpControllerDriverVar.scope.$parent.getRate(calcData,calcObj);

                    rateObj.monthly.payroll_deduct = rateObj.base.payroll_deduct * (amount / 50);
                    rateObj.monthly.direct_bill = rateObj.base.direct_bill * (amount / 50);

                    rateObj.annual.payroll_deduct = rateObj.monthly.payroll_deduct * 12;
                    rateObj.annual.direct_bill = rateObj.monthly.direct_bill * 12;

                    xmpControllerDriverVar.scope.calcRate = rateObj;

                    xmpControllerDriverVar.scope.showRates = true;
                });

            };

            xmpControllerDriverVar.scope.resetRate();
            //xmpControllerDriverVar.scope.updateLang(xmpControllerDriverVar.scope.$parent.url_code);

        });
    });
};