const checkAdmin = (req, res, next) => {
    if(req.session.is_admin !== undefined) {
      if (req.session.is_admin === true) {
        next();
        return;
      }else{
        res.status(403).render("forOFor", {
          status: 403,
          errorText: "Nedovoljna razina ovlasti",
          link: "/login",
        });
      }
    }else{
      res.status(500).render("forOFor", {
        status: 500,
        errorText: "Nemoguće provjeriti razinu ovlasti",
        link: "/login",
      });
    }
  }

module.exports = checkAdmin;