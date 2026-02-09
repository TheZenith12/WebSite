
import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";

export const getFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate("resortsId")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("getFiles алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};


export const uploadFile = async (req, res) => {
  try {
    const { resortId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Файл илгээгээгүй байна." });
    }

    if (!resortId) {
      return res.status(400).json({ message: "resortId шаардлагатай." });
    }


    const resort = await Resort.findById(resortId);
    if (!resort) {
      return res.status(404).json({ message: "Resort олдсонгүй." });
    }


    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder: "resorts"
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Upload амжилтгүй" });
        }

    const newFile = new File({
      resortsId: resortId,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      image: file.mimetype.startsWith("image") ? fileUrl : "",
      video: file.mimetype.startsWith("video") ? fileUrl : "",
    });

    await newFile.save();


    await Resort.findByIdAndUpdate(resortId, { $push: { files: newFile._id } });

    res.status(201).json({
      success: true,
      message: "Файл амжилттай хадгалагдлаа",
      file: newFile,
    });
  }
    );

    uploadResult.end(file.buffer);

  } catch (err) {
    console.error("Upload file error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "Файл олдсонгүй." });




    await Resort.updateMany({ files: id }, { $pull: { files: id } });


    await File.findByIdAndDelete(id);

    res.json({ success: true, message: "Файл амжилттай устгагдлаа" });
  } catch (err) {
    console.error("deleteFile алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createResort = async (req, res) => {
  try {
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
