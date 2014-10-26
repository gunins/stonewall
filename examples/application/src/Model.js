/**
 * Created by guntars on 24/10/14.
 */
define(function () {
    return function (data) {
        var pie1 = data.pie1.chartcontent;
        var pie2 = data.pie2.chartcontent;
        var pie3 = data.pie3.chartcontent;
        var pie4 = data.pie4.chartcontent;
        setTimeout(function () {
            pie1.data = [
                {age: '<6', population: 27046},
                {age: '5-14', population: 44998},
                {age: '14-18', population: 31590},
                {age: '18-25', population: 38537},
                {age: '25-45', population: 24106},
                {age: '45-65', population: 8816},
                {age: '≥66', population: 61246}
            ];

        }.bind(this), 2000);

        setTimeout(function () {
            pie2.data = [
                {age: '<6', population: 270460},
                {age: '5-14', population: 449985},
                {age: '14-18', population: 215900},
                {age: '18-25', population: 385378},
                {age: '25-45', population: 141065},
                {age: '45-65', population: 88160},
                {age: '≥66', population: 612463}
            ];

        }.bind(this), 4000);
        setTimeout(function () {
            pie3.data = [
                {age: '<6', population: 27046},
                {age: '5-14', population: 449985},
                {age: '14-18', population: 215900},
                {age: '18-25', population: 38537},
                {age: '25-45', population: 141065},
                {age: '45-65', population: 8816},
                {age: '≥66', population: 612463}
            ];

        }.bind(this), 1000);

        setTimeout(function () {
            pie4.data = [
                {age: '<6', population: 370460},
                {age: '5-14', population: 449985},
                {age: '14-18', population: 315900},
                {age: '18-25', population: 385378},
                {age: '25-45', population: 241065},
                {age: '45-65', population: 88160},
                {age: '≥66', population: 612463}
            ];

        }.bind(this), 3000);

    };
});