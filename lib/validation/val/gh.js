// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var gh;

  gh = function(validation) {
    return validation.gh = {
      add_team_asset: function(team, asset) {
        return true;
      },
      remove_team_asset: function(team, asset) {
        return true;
      }
    };
  };

  if (typeof window !== "undefined" && window !== null) {
    gh(window.kratos.validation.validation);
  } else if (typeof exports !== "undefined" && exports !== null) {
    module.exports = gh;
  }

}).call(this);
