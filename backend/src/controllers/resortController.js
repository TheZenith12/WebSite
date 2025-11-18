import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";



function extractPublicId(url) {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let rest = parts[1];
    rest = rest.replace(/^v\d+\//, "");
    return rest.split(".")[0];
  } catch {
    return null;
  }
}

// --------------------------------------------------
// ✅ GET ALL Resorts
// --------------------------------------------------
export const getResorts = async (req, res) => {
  try {
    const resorts = await Resort.aggregate([
      {
        $lookup: {
          from: "files",
          localField: "_id",
          foreignField: "resortsId",
          as: "files",
        },
      },
      {
        $addFields: { image: { $arrayElemAt: ["$files.images", 0] } },
      },
      { $project: { files: 0, __v: 0 } },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: resorts.length,
      resorts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------
// ✅ GET Resort by ID
// --------------------------------------------------
export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) return res.status(404).json({ message: "Not found" });

    const files = await File.find({ resortsId: resort._id });
    res.json({ resort, files });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------
// ✅ CREATE Resort (Frontend direct upload → URL дамжуулна)
// --------------------------------------------------
export const createResort = async (req, res) => {
  try {
    const { name, description, price, location, images, videos } = req.body;

    const newResort = new Resort({ name, description, price, location });
    const savedResort = await newResort.save();

    if ((images?.length || 0) + (videos?.length || 0) > 0) {
      const newFile = new File({
        resortsId: savedResort._id,
        images: images || [],
        videos: videos || [],
      });
      await newFile.save();
    }

    res.status(201).json({
      success: true,
      message: "Resort амжилттай нэмэгдлээ",
      resort: savedResort,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const  updateResort = async (req, res) => {
  try {
    const { id } = req.params;

    // Frontend ээс ирсэн CLOUDINARY URL-үүд
    const {
      title,
      location,
      description,
      price,
      images, // энэ нь Array(URL) байх ёстой
      videos, // Array(URL)
    } = req.body;

    const updatedResort = await Resort.findByIdAndUpdate(
      id,
      {
        title,
        location,
        description,
        price,
        images, 
        videos,
      },
      { new: true }
    );

    return res.json({
      success: true,
      resort: updatedResort,
    });
  } catch (err) {
    console.log("❌ UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Not found" });

    const files = await File.find({ resortsId: id });

    await File.deleteMany({ resortsId: id });
    await Resort.findByIdAndDelete(id);

    res.json({ success: true, message: "Resort deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
