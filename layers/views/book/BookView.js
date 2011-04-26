var AbstractView = require('../AbstractView');

BookView = function() {};

BookView.prototype = new AbstractView();

BookView.prototype.getType = function() {
    return "book";
};

BookView.prototype.getTemplate = function() {
    return "book.jade";
};

module.exports = BookView;