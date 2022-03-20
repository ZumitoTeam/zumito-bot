const { t } = require("localizify");

String.prototype.trans = function(params) {
    return params ?  t(this, params) : t(this);
}