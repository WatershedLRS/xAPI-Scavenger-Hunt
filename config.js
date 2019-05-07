var cfg = {};
cfg.lrs;

try {
  lrs = new TinCan.LRS(
    {
      endpoint: "https://sandbox.watershedlrs.com/api/organizations/5664/lrs/",
      username: "bd801ab915763c",
      password: "3bd00c675aeddd",
      allowFail: false
    }
  );
}
catch (ex) {
  console.log("Failed to setup LRS object: ", ex);
}

cfg.employeeList = {
  "andrew.downes@watershedlrs.com": "Andrew Downes"
};

cfg.attendeeList = ["Joe Bloggs", "Jane Doe"];

cfg.shareUrl = 'https://sandbox.watershedlrs.com/app/index.html#/share/68e10fcdc29d';