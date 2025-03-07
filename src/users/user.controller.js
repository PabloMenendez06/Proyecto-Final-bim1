import User from "./user.model.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, "-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, email, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, username, email, role },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }


        const validPassword = await argon2.verify(user.password, password);

        if (!validPassword) {
            return res.status(400).json({ success: false, msg: "Incorrect password" });
        }

        user.estado = false;
        await user.save();

        res.json({ success: true, msg: "User account deactivated", user });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error deactivating user account", error });
    }
};



export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["ADMIN", "CLIENT"].includes(role)) {
            return res.status(400).json({ msg: "Invalid role. Allowed roles: ADMIN, CLIENT" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ success: true, msg: "User role updated", updatedUser });
    } catch (error) {
        res.status(500).json({ msg: "Error updating user role", error });
    }
};

