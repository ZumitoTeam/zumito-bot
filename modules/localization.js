const { t } = require("localizify");

String.prototype.trans = function(params) {
    return String(params ?  t(this, params) : t(this));
}