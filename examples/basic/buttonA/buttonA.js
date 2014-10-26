define(function () {
    return function(){
        var el = document.createElement('div');
        el.innerHTML = 'Other test Button A';
        var button = document.createElement('button');
        button.innerHTML = 'Test Button';
        el.appendChild(button);
        return{
            el: el
        }
    };

});