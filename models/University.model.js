const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const universitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    abbreviatedName: {
        type: String,
        unique: true,
        required: true
    }
});

const University = mongoose.model("University", universitySchema);

const universities = [
    { name: "Барилга, архитектурын сургууль", abbreviatedName: "БАС" },
    { name: "Бизнесийн ахисан түвшний сургууль", abbreviatedName: "БАТС" },
    { name: "Бизнесийн удирдлага, хүмүүнлэгийн сургууль", abbreviatedName: "БуХС" },
    { name: "Геологи, уул уурхайн сургууль", abbreviatedName: "ГУУС" },
    { name: "Гадаад хэлний сургууль", abbreviatedName: "ГХС" },
    { name: "Механик, тээврийн сургууль", abbreviatedName: "MехТС" },
    { name: "Мэдээлэл, холбоо технологийн сургууль", abbreviatedName: "МХТС" },
    { name: "Үйлдвэрлэлийн технологийн сургууль", abbreviatedName: "ҮТС" },
    { name: "Хэлний шинжлэх ухааны сургууль", abbreviatedName: "ХШУС" },
    { name: "Эрчим хүчний сургууль", abbreviatedName: "ЭХС" },
];

const initializeUniversities = async () => {
    try {
        for (const university of universities) {
            const existingUniversity = await University.findOne({ abbreviatedName: university.abbreviatedName });

            if (!existingUniversity) {
                await University.create(university);
            }
        }
        console.log("Default universities initialized successfully");
    } catch (error) {
        console.error("Error initializing default universities:", error.message);
    }
};

module.exports = {
    University,
    universitySchema,
    initializeUniversities
}