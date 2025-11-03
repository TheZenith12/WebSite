import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-green-100 to-blue-100 shadow-sm">
        <h1 className="text-4xl font-bold mb-3 text-green-800">Бидний тухай</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          “Амралтын Газар” бол байгальд ойр, тухтай, тайван орчинд амрах боломжийг санал болгодог
          Монголын шилдэг амралтын газруудын нэг юм.
        </p>
      </section>

      {/* 1. Манай тухай */}
      <section className="max-w-6xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center gap-10">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Resort view"
          className="w-full md:w-1/2 rounded-2xl shadow-lg"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">🏞 Манай тухай</h2>
          <p className="text-gray-700 leading-relaxed">
            Бид Монголын үзэсгэлэнт байгальд байрлах амралтын газруудаар дамжуулан аялагч, гэр бүл,
            хамт олон бүрт амралт, тав тух, байгалийн гоо үзэсгэлэнг мэдрүүлэхийг зорьдог.  
            Амрагч бүрт зориулсан тохилог байр, амтат хоол, болон тайван орчныг бүрдүүлж өгдөг.
          </p>
        </div>
      </section>

      {/* 2. Манай үйлчилгээ */}
      <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-green-700 mb-8">✨ Манай үйлчилгээ</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition">
              <img
                src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba"
                alt="Accommodation"
                className="rounded-xl mb-4 h-40 w-full object-cover"
              />
              <h3 className="font-semibold text-lg mb-2">Тав тухтай байр</h3>
              <p className="text-gray-600 text-sm">
                Гэр бүл, найз нөхөд, байгууллагад тохирсон тохилог, цэвэрхэн байрны сонголт.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition">
              <img
                src="https://images.unsplash.com/photo-1582719478175-2d3dfb2c6b88"
                alt="Food"
                className="rounded-xl mb-4 h-40 w-full object-cover"
              />
              <h3 className="font-semibold text-lg mb-2">Амтат хоол, үйлчилгээ</h3>
              <p className="text-gray-600 text-sm">
                Орон нутгийн болон европ хоолны өргөн сонголт, чанартай үйлчилгээтэй ресторан.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                alt="Recreation"
                className="rounded-xl mb-4 h-40 w-full object-cover"
              />
              <h3 className="font-semibold text-lg mb-2">Амралт, зугаа цэнгэл</h3>
              <p className="text-gray-600 text-sm">
                Сагсан бөмбөг, завиар зугаалах, галын наадам, усанд сэлэлт зэрэг олон төрлийн
                зугаатай хөтөлбөрүүдтэй.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Манай зорилго */}
      <section className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-green-700 mb-4">🎯 Манай зорилго</h2>
        <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
          “Амралтын Газар” төслийн үндсэн зорилго бол Монголын аялал жуулчлалын чанарыг шинэ түвшинд хүргэх.
          Бид хүн бүрийг стрессээ тайлж, байгальтайгаа дотно харилцах боломжийг бүрдүүлэхийг эрмэлздэг.  
          Амралт гэдэг зөвхөн амрах бус, шинэ эрч хүч авах мөч гэж бид итгэдэг.
        </p>
      </section>
    </div>
  );
}
