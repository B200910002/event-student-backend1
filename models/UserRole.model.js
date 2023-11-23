const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    roleName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Role = mongoose.model("Role", roleSchema);

const roles = [
    { roleName: "ADMIN", description: "Administrator role" },
    { roleName: "SUPERADMIN", description: "Super administrator role" },
    { roleName: "CLUBPRESIDENT", description: "Role for club presidents" },
    { roleName: "TEACHER", description: "Role for teachers" },
];

const initializeRoles = async () => {
    try {
        for (const roleData of roles) {
            const existingRole = await Role.findOne({ roleName: roleData.roleName });

            if (!existingRole) {
                await Role.create(roleData);
            }
        }
        console.log("Default roles initialized successfully");
    } catch (error) {
        console.error("Error initializing default roles:", error.message);
    }
};

module.exports = {
    Role,
    roleSchema,
    initializeRoles
}
