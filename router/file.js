const Router = require("koa-router");
const router = new Router();
const multer = require("@koa/multer");
const path = require("path");

const typeFileMulter = (fileType) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), `/static/${fileType}`));
    },
    filename: function (req, file, cb) {
      let type = file.originalname.split(".")[1];
      cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`);
    },
  });
  let limits;
  switch (fileType) {
    case "image": {
      limits = {
        fields: 10, //非文件字段的数量
        fileSize: 500 * 1024, //文件大小 单位 b
        files: 1, //文件数量
      };
      break;
    }
    case "audio": {
      limits = {
        fields: 10, //非文件字段的数量
        fileSize: 1000 * 1024, //文件大小 单位 b
        files: 1, //文件数量
      };
      break;
    }
    case "video": {
      limits = {
        fields: 10, //非文件字段的数量
        fileSize: 5000 * 1024, //文件大小 单位 b
        files: 1, //文件数量
      };
      break;
    }
  }

  const upload = multer({ storage, limits });
  return upload;
};
const imageUpload = typeFileMulter("image");
const audioUpload = typeFileMulter("audio");
const videoUpload = typeFileMulter("video");
router.post("/upload/image", imageUpload.single("file"), async (ctx, next) => {
  const filename = ctx.file.filename;
  ctx.body = {
    code: 200,
    filepath: `http://212.64.75.109/image/${filename}`,
  };
});
router.post("/upload/audio", audioUpload.single("file"), async (ctx, next) => {
  ctx.body = {
    data: ctx.file,
  };
});
router.post("/upload/video", videoUpload.single("file"), async (ctx, next) => {
  ctx.body = {
    data: ctx.file,
  };
});
module.exports = router;
