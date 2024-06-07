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

            xmpControllerDriverVar.scope.salary = {
                "display": "",
                "annual": "",
                "monthly": "",
            };

            xmpControllerDriverVar.scope.calcRate = {
                "estimatedLtd": "",
                "estimatedLtdReplacement": "",
                "uninsuredIncomeMonthlyGap": "",
                "monthlyDisabilityGapInsuranceBenefitAvailable": "",
                "totalMonthlyCoverage": "",
                "totalLtdDisabilityGapInsuranceReplacement": "",
            };

            xmpControllerDriverVar.scope.resetRate = function() {
                xmpControllerDriverVar.scope.showRates = false;

                xmpControllerDriverVar.scope.calcRate = {
                    "estimatedLtd": "",
                    "estimatedLtdReplacement": "",
                    "uninsuredIncomeMonthlyGap": "",
                    "monthlyDisabilityGapInsuranceBenefitAvailable": "",
                    "totalMonthlyCoverage": "",
                    "totalLtdDisabilityGapInsuranceReplacement": "",
                };

            };

            xmpControllerDriverVar.scope.formatSalary = function() {
                var salaryInput = xmpControllerDriverVar.scope.salary.display;

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

                xmpControllerDriverVar.scope.salary.display = salaryFormatted;
                $("#salary_display").val(xmpControllerDriverVar.scope.salary.display);

                xmpControllerDriverVar.scope.checkSalary();

            };

            xmpControllerDriverVar.scope.checkSalary = function() {

                xmpControllerDriverVar.scope.disSalaryBenefitMax = 0;

                var salaryInput = xmpControllerDriverVar.scope.salary.display;

                if (!salaryInput) {
                    salaryInput = $("#salary_display").val();
                }

                if (!salaryInput) {
                    salaryInput = "";
                }

                if (salaryInput) {

                    var salaryTrimmed = salaryInput.replace(/[^0-9]/g, "");

                    if (salaryTrimmed) {

                        xmpControllerDriverVar.scope.salary.annual = parseInt(salaryTrimmed);
                        xmpControllerDriverVar.scope.salary.monthly = xmpControllerDriverVar.scope.salary.annual / 12;

                        console.log("salary", xmpControllerDriverVar.scope.salary);

                    }

                }

                xmpControllerDriverVar.scope.resetRate();

            };

            xmpControllerDriverVar.scope.calcSubmit = function() {

                xmpControllerDriverVar.scope.resetRate();

                console.log("calcSubmit reached");

                // copying salary and rates objects for less clutter in calculations
                let salary = xmpControllerDriverVar.scope.salary;
                let rates = xmpControllerDriverVar.scope.calcRate;

                // Estimated LTD = Monthly Income * 0.6; Maximum of 12500
                rates.estimatedLtd = salary.monthly * 0.6;
                if (rates.estimatedLtd > 12500) {
                    rates.estimatedLtd = 12500;
                }

                // Estimated LTD Replacement = Estimated LTD / Monthly Income
                rates.estimatedLtdReplacement = Math.round((rates.estimatedLtd / salary.monthly) * 100) + "%";

                // Uninsured Income/Monthly Gap = Monthly Income - Estimated LTD
                rates.uninsuredIncomeMonthlyGap = salary.monthly - rates.estimatedLtd;

                // Monthly Disability Gap Insurance Benefit Available = Monthly Income * 0.6667; Maximum of 17500; Increment by 50
                rates.monthlyDisabilityGapInsuranceBenefitAvailable = Math.round(((salary.monthly * 0.667) - rates.estimatedLtd) / 50) * 50;
                if (rates.monthlyDisabilityGapInsuranceBenefitAvailable > 17500) {
                    rates.monthlyDisabilityGapInsuranceBenefitAvailable = 17500;
                }

                // Total Monthly Coverage = Estimated LTD + Monthly Disability Gap Insurance Benefit Available
                rates.totalMonthlyCoverage = rates.estimatedLtd + rates.monthlyDisabilityGapInsuranceBenefitAvailable;

                // Total LTD + Disability Gap Insurance Replacement = Total Monthly Coverage / Monthly Income
                rates.totalLtdDisabilityGapInsuranceReplacement = Math.round((rates.totalMonthlyCoverage / salary.monthly) * 100) + "%";

                console.log("salary", salary);
                console.log("rates", rates);
                console.log("calcRate", xmpControllerDriverVar.scope.calcRate);

                xmpControllerDriverVar.scope.showRates = true;

            };

            xmpControllerDriverVar.scope.resetRate();

        });
    });
};