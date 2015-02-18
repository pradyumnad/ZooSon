/**
 * Created by pradyumnad on 18/02/15.
 */

function Trainer(_options) {
    var options = _options || {};

    this.animal = _options.animal;
    this.set = _options.set;
    this.results = [];
}

Trainer.prototype.train = function() {
    console.log("Training the given set..");

    this.results = this.set;
};

Trainer.prototype.fetchAnimal = function(text) {
    if(contains(this.results, text.toLowerCase())) {
        return this.animal;
    }
    return text;
};

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}