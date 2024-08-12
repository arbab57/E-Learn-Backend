const Admin = require("../models/adminSchema")
const Catagory = require("../models/catagoriesSchema");
const Course = require("../models/courseSchema");
const Mentor = require("../models/mentorSchema")
const User = require("../models/userSchema");
const Video = require("../models/videoSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("../config/crypto");

// To login admin
exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email })
        if (!admin) return res.status(404).json({ message: "Admin not found!" })
        const IsMatch = await bcrypt.compare(password, admin.password)
        if (!IsMatch) return res.status(401).json({ message: "Wrong password!" })
        let payload = { id: admin._id };
        const token = jwt.sign(payload, SECRET_TOKEN);
        res.cookie("token", token, {
            httpOnly: true,
            // maxAge: 60 * 60 * 1000
        });
        res.status(200).send({
            message: "Admin successfully logged in",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


// Admin -- Get All Users 
exports.user = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "No token, authorization denied" });
        const decoded = jwt.verify(token, SECRET_TOKEN);
        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(401).json({ message: "Invalid token" });
        const users = await User.find()
        const userData = users.map((user) => {
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                boughtCourse: user.boughtCourses,
                savedCourses: user.savedCourses,
                completed: user.completed,
                noOfBoughtCourses: user.noOfBoughtCourses,
                noOfSavedCourses: user.noOfSavedCourses
            }
        })
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}


// Admin --delete a single User  
exports.deletUser = async (req, res) => {
    try {
        const userId = req.id;
        const delUser = await User.deleteOne({ _id: userId });
        if (!delUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully!",
        });
    } catch (error) {
        res.status().json({
            message: "Server Error"
        });
    }
};


// Admin --delete a single Review 
exports.deletReview = async (req, res) => {
    try {
        const { courseId, reviewId } = req.params;
        if (!courseId || !reviewId) {
            return res.status(400).json({ message: 'Course ID and Review ID are required' });
        }
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        course.data.reviews = course.data.reviews.filter((review) => !review.equals(reviewId))
        await course.save();
        res.status(200).json({

            message: "Review Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// to Add new mentor
exports.addMentor = async (req, res) => {
    try {
        const { name, image, about, title } = req.body;
        const newMentor = new Mentor({
            name: name,
            image: image,
            about: about,
            title: title,
        })
        await newMentor.save();
        res.status(200).json({
            message: "Mentor added siccessfully!"
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

// To update mentor details
exports.updataMentor = async (req, res) => {
    try {
        const { name, image, about, title } = req.body;
        const { mentorId } = req.params;
        const findMentor = await Mentor.findOne({ _id: mentorId })
        if (!findMentor) {
            return res.status(404).json({ message: "Mentor not fund!" })
        }
        findMentor.name = name || findMentor.name;
        findMentor.image = image || findMentor.image;
        findMentor.about = about || findMentor.about;
        findMentor.title = title || findMentor.title
        await findMentor.save();
        res.status(200).json({
            message: "Mentor updated siccessfully!"
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

// to delete mentor
exports.deleteMentor = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const findMentor = await Mentor.findOne({ _id: mentorId })
        if (!findMentor) {
            return res.status(404).json({ message: "Mentor not found!" })
        }
        await Mentor.deleteOne({ _id: mentorId })
        // await newMentorsList.save();
        res.status(200).json({
            message: "Mentor deleted siccessfully!"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// to add course in mentor courses
exports.addMentorCourses = async (req, res) => {
    try {
        const { courseId, mentorId } = req.params;
        const getMentor = await Mentor.findOne({ _id: mentorId })
        if (!getMentor) {
            return res.status(404).json({ message: "Mentor not found!" })
        }
        getMentor.courses.push(courseId)
        await getMentor.save();
        res.status(200).json({
            message: "Course addded successfully!",
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// To delete coursee from mentor courses
exports.deleteMentorCourses = async (req, res) => {
    try {
        const { courseId, mentorId } = req.params;
        const getMentor = await Mentor.findOne({ _id: mentorId })
        if (!getMentor) {
            return res.status(404).json({ message: "Mentor not found!" })
        }
        getMentor.courses.pull(courseId)
        await getMentor.save();
        res.status(200).json({
            message: "Course deleted successfully!",
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}












