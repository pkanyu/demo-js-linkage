import Debug "mo:base/Debug";

actor {
  var name : Text = "";
  var age : Nat = 0;
  var school : Text = "";

  public func setName(n : Text) : async () {
    name := n;
  };

  public func setAge(a : Nat) : async () {
    age := a;
  };

  public func setSchool(s : Text) : async () {
    school := s;
  };

  public query func getInfo() : async Text {
    return "Name: " # name # ", Age: " # debug_show(age) # ", School: " # school;
  };
};