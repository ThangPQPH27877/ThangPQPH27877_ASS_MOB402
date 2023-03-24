const express = require("express");
const expressHbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const User = require("./user.js");
const Products = require("./product");
// const fileType = require("file-type ");
var fs = require("fs");
const app = express();
const user = new Array();
const products = new Array();
products.push(
  new Products(
    "1",
    "Mũ cối",
    "10000",
    "https://product.hstatic.net/200000411579/product/7891_5b09d9656972b45e666b7fc2d4f00654_2a40dd5dea924ad1b14d7c1c999e5689_125eca8b89884122bd1962b95d5f4866_master.jpg",
    "white",
    "skin",
    "1",
    "Phạm Quang Thắng"
  )
);
products.push(
  new Products(
    "2",
    "Áo Omachi",
    "20000",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8XiN6kBbxbl3RWgzz1LBbNlTw_NPepN24ew&usqp=CAU",
    "white",
    "skin",
    "1",
    "Le Thi Ha Ly"
  )
);
products.push(
  new Products(
    "3",
    "Quần style",
    "30000",
    "https://order.tokago.vn/uploads/2019/8/28/15//044367f097267415621bd313590a9eef.png",
    "white",
    "skin",
    "1",
    "Le Quang Duc"
  )
);
products.push(
  new Products(
    "4",
    "Giày jokdan",
    "40000",
    "https://shopgiayreplica.com/wp-content/uploads/2022/08/jordan-1-high-black-white-like-auth-1.jpg",
    "white",
    "skin",
    "2",
    "Pham Quang A"
  )
);
products.push(
  new Products(
    "5",
    "Balo",
    "50000",
    "https://cdn.shopify.com/s/files/1/0567/3992/2095/products/balo-nam-balo-laptop_5_600x600_crop_center.jpg?v=1621421308",
    "white",
    "skin",
    "2",
    "Trịnh Công B"
  )
);
user.push(
  new User(
    "1",
    "admin@gmail.com",
    "123",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnwguLPh2SY6Nfqwcz1Aw_3cSiElE3dQxNbQ&usqp=CAU",
    "ADMIN"
  )
);

user.push(
  new User(
    "2",
    "lehaly@gmail.com",
    "123",
    "https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-6/309165041_803970424172624_6904171011953423156_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=vllTTheGvDMAX-Zq96I&_nc_ht=scontent.fhan5-8.fna&oh=00_AfCBOwbdn_Nicc15GvH2Jg3B6j_xC9OpoJBWFpqG1pubKg&oe=642058FF",
    "Le Thi Ha Ly"
  )
);
user.push(
  new User(
    "3",
    "lqduc@gmail.com",
    "123",
    "https://www.pandasecurity.com/en/mediacenter/src/uploads/2019/07/pandasecurity-How-do-hackers-pick-their-targets.jpg",
    "Le Quang Duc"
  )
);
user.push(
  new User(
    "4",
    "thangpqph27877@gmail.com",
    "123",
    "https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-6/306096742_1452043935205023_6904588716601833142_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=u3fdIla8nX8AX9mfRxP&_nc_ht=scontent.fhan5-8.fna&oh=00_AfDDzoZ0CLDvP38o2ITVGm_SAlde6M1lQAvoOHzwKq2pzQ&oe=64222507",
    "Phạm Quang Thắng"
  )
);
user.push(
  new User(
    "5",
    "ndhai@gmail.com",
    "123",
    "https://www.bleepstatic.com/content/hl-images/2022/09/30/cyber-hacker.jpg",
    "Nguyen Duy Hai"
  )
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = 3000;
const checkFile = (req, res, next) => {
  if (!req.file) {
    return res.status(500).send("Please upload a file");
  }
  next();
};
const checkUserNamePassword = (email, password, res) => {
  if (email == "admin@gmail.com" && password == "123") {
    res.render("emptyView", { layout: "layoutHome", user: user });
  } else {
    res.render("emptyView", { layout: "layoutLoginErr" });
  }
};
const checkRegister = (email, password, repassword, name, res, img, req) => {
  if (
    password != repassword ||
    password == "" ||
    repassword == "" ||
    email == "" ||
    name == ""
  ) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi khi xoá file");
      }
    });
    res.render("emptyView", { layout: "registerErr" });
  } else {
    user.push(new User(0, email, password, `'/${img}'`, name));
    res.render("login", { layout: "main" });
  }
};
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = "./public";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, "public");
  },
  filename: function (req, file, cb) {
    var tenGoc = file.originalname;
    arr = tenGoc.split(".");

    let newFileName = "";

    for (let i = 0; i < arr.length; i++) {
      if (i != arr.length - 1) {
        newFileName += arr[i];
      } else {
        newFileName += "-" + Date.now() + "." + arr[i];
      }
    }

    cb(null, newFileName);
  },
});

var upload = multer({
  storage: storage,
});
app.get("/home", (req, res, next) => {
  res.render("emptyView", { layout: "layoutHome", user: user });
});
app.get("/products", (req, res, next) => {
  res.render("emptyView", { layout: "layoutProducts", products: products });
});
app.post("/register", upload.single("myFile"), checkFile, (req, res, next) => {
  const email = req.body.rsemail;
  const password = req.body.rspassword;
  const repass = req.body.rsrepassword;
  const name = req.body.name;
  const img = req.file.originalname;
  console.log(email);
  console.log(password);
  console.log(repass);
  console.log(name);
  checkRegister(email, password, repass, name, res, img, req);
});
app.post("/products/delete", (req, res) => {
  const remove = products.findIndex(
    (item) => item.id == Number(req.body.itemId)
  );
  products.splice(remove, 1);
  res.redirect("/products");
});
app.post("/home/delete", (req, res) => {
  const remove = user.findIndex((item) => item.id == Number(req.body.itemId));
  user.splice(remove, 1);
  res.redirect("/home");
});
app.post("/products/edit", (req, res) => {
  const edit = products.findIndex((item) => item.id == Number(req.body.itemId));
  console.log(req.body);
  products[edit] = new Products(
    req.body.itemId,
    req.body.name,
    req.body.price,
    req.body.img,
    req.body.color,
    req.body.type,
    req.body.idUser,
    req.body.nameUser
  );
  res.redirect("/products");
});
app.post("/home/edit", (req, res) => {
  const edit = user.findIndex((item) => item.id == Number(req.body.itemId));
  console.log(req.body);
  user[edit] = new User(
    req.body.itemId,
    req.body.email,
    req.body.password,
    req.body.img,
    req.body.name
  );
  res.redirect("/home");
});
app.post("/home/add-user", (req, res) => {
  const email = req.body.email;
  const id = req.body.id;
  const password = req.body.password;
  const img = req.body.img;
  const name = req.body.name;
  if (email == "" || id == "" || password == "" || img == "") {
    res.status(400).json({ error: "Add user failed" });
  } else {
    user.push(new User(id, email, password, img, name));
  }
  res.redirect("/home");
});
app.post("/products/add-products", (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  const price = req.body.price;
  const img = req.body.img;
  const type = req.body.type;
  const color = req.body.color;
  const idUser = req.body.idUser;
  const nameUser = req.body.nameUser;
  if (name == "" || id == "" || price == "" || img == "") {
    res.status(400).json({ error: "Add products failed" });
  } else {
    products.push(
      new Products(id, name, price, img, color, type, idUser, nameUser)
    );
  }
  res.redirect("/products");
});
app.post("/home/search", (req, res) => {
  let userSearch = new Array();
  user.map((item, index, arr) => {
    if (item.email.includes(req.body.txtSearch) == true) {
      userSearch.push(item);
    }
  });
  res.render("emptyView", { layout: "layoutHome", user: userSearch });
});
app.post("/products/search", (req, res) => {
  let productSearch = new Array();
  products.map((item, index, arr) => {
    if (item.name.includes(req.body.txtSearch) == true) {
      productSearch.push(item);
    }
  });
  res.render("emptyView", {
    layout: "layoutProducts",
    products: productSearch,
  });
});
app.engine(
  ".hbs",
  expressHbs.engine({
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.get("/", (req, res) => {
  console.log(req.body);
  res.render("register", { layout: "main" });
});
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email);
  console.log(password);
  checkUserNamePassword(email, password, res);
});
app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
