const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const mongoose = require('mongoose');
const { connectToMongo } = require('./models/conn');
const { User, Lab, Reservation, Admin } = require('./models/models');
const bcrypt = require('bcrypt');

async function hashPassword(plainTextPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
}

connectToMongo(async (err) => {
    if (err) {
        console.error("Connection failed", err);
        process.exit(1);
    }

    try {
        // Clear existing data to prevent duplicates
        await User.deleteMany({});
        await Admin.deleteMany({}); 
        await Lab.deleteMany({});
        await Reservation.deleteMany({});

        // 1. Insert Users
        const users = await User.insertMany([
            { username: "felix", name: "Felix Kjellberg", dlsu_id: "12423456", college: "College of Science", email: "pewds@dlsu.edu.ph", avatar: "FK", password: await hashPassword("BroFist1989")},
            { username: "mark", name: "Mark Fishbach", dlsu_id: "12498765", college: "Gokongwei College of Engineering", email: "markiplier@dlsu.edu.ph", avatar: "MF", password: await hashPassword("Mark2013")},
            { username: "hermione", name: "Hermione Granger", dlsu_id: "12400001", college: "College of Business", email: "h.granger@dlsu.edu.ph", avatar: "HG", password: await hashPassword("Ron2012")},
            { username: "marques", name: "Marques Brownlee", dlsu_id: "12454433", college: "College of Computer Studies", email: "mkbhd@dlsu.edu.ph", avatar: "MB", password: await hashPassword("Tesla2026")},
            { username: "linus", name: "Linus Sebastian", dlsu_id: "12447788", college: "College of Computer Studies", email: "linus@dlsu.edu.ph", avatar: "LS", password: await hashPassword("Linus2026")}
        ]);

        // 2. Insert Admins 
        const admin = await Admin.insertMany([
            { username: "james", name: "James McAvoy", admin_id: "238996", email: "admin_james@dlsu.edu.ph", avatar: "JM", password: await hashPassword("Xavier2011")}, 
            { username: "max", name: "Max Verstappen", admin_id: "234112", email: "admin_max@dlsu.edu.ph", avatar: "MV", password: await hashPassword("Formula12024")}, 
            { username: "steph", name: "Stephen Curry", admin_id: "233030", email: "admin_steph@dlsu.edu.ph", avatar: "SC", password: await hashPassword("ForThree1988")}, 
            { username: "luka", name: "Luka Doncic", admin_id: "237777", email: "admin_luka@dlsu.edu.ph", avatar: "LD", password: await hashPassword("Slovenia1999")}, 
            { username: "david", name: "David Guetta", admin_id: "231967", email: "admin_david@dlsu.edu.ph", avatar: "DG", password: await hashPassword("PlayTheBeat1967")}, 
        ]); 

        // 3. Insert Labs
        const labs = await Lab.insertMany([
            { lab_id: "lab-a", name: "Computer Lab A (Science Bldg)", type: "Standard", stations: ["SPC-01", "SPC-02", "SPC-03", "SPC-04", "SPC-05"] },
            { lab_id: "lab-b", name: "Computer Lab B (Library)", type: "Standard", stations: ["LIB-01", "LIB-02", "LIB-03", "LIB-04", "LIB-05"] },
            { lab_id: "mac-lab-a", name: "Mac Lab A (Design Dept)", type: "Mac", stations: ["MCA-01", "MCA-02", "MCA-03", "MCA-04", "MCA-05"] }, 
            { lab_id: "lab-c", name: "Computer Lab C (Engineering Dept)", type: "Standard", stations: ["EPC-01", "EPC-02", "EPC-03", "EPC-04", "EPC-05"]}, 
            { lab_id: "mac-lab-b", name: "Mac Lab B (Arts Dept)", type: "Mac", stations: ["MCB-01", "MCB-02", "MCB-03", "MCB-04", "MCB-05"]}
        ]);

        // 4. Insert Reservations 
        await Reservation.insertMany([
            // Lab A slots
            { date: "Mar 25, 2026", time: "9:00 AM - 10:00 AM", lab_id: "lab-a", station: "SPC-01", status: "Available" },
            { date: "Mar 25, 2026", time: "9:00 AM - 10:00 AM", lab_id: "lab-a", station: "SPC-02", status: "Reserved", username: "felix" },
            { date: "Mar 25, 2026", time: "9:00 AM - 10:00 AM", lab_id: "lab-a", station: "SPC-03", status: "Reserved", username: "mark" },
            { date: "Mar 25, 2026", time: "10:00 AM - 10:30 AM", lab_id: "lab-a", station: "SPC-04", status: "Available" },
            { date: "Mar 25, 2026", time: "10:30 AM - 11:00 AM", lab_id: "lab-a", station: "SPC-05", status: "Available" },
            
            // Lab B slots
            { date: "Mar 26, 2026", time: "9:00 AM - 10:00 AM", lab_id: "lab-b", station: "LIB-01", status: "Reserved", username: "mark", is_anonymous: true }, 
            { date: "Mar 26, 2026", time: "9:00 AM - 10:00 AM", lab_id: "lab-b", station: "LIB-02", status: "Available" },
            { date: "Mar 26, 2026", time: "9:00 AM - 9:30 AM", lab_id: "lab-b", station: "LIB-03", status: "Available" },
            { date: "Mar 26, 2026", time: "10:00 AM - 11:00 AM", lab_id: "lab-b", station: "LIB-04", status: "Reserved", username: "hermione" },
            { date: "Mar 26, 2026", time: "10:00 AM - 11:00 AM", lab_id: "lab-b", station: "LIB-05", status: "Reserved", username: "mark" }, 
            
            // Mac Lab A slots
            { date: "Mar 27, 2026", time: "9:00 AM - 10:00 AM", lab_id: "mac-lab-a", station: "MCA-01", status: "Reserved", username: "marques" },
            { date: "Mar 27, 2026", time: "9:00 AM - 10:00 AM", lab_id: "mac-lab-a", station: "MCA-02", status: "Reserved", username: "linus" },
            { date: "Mar 27, 2026", time: "10:00 AM - 11:00 AM", lab_id: "mac-lab-a", station: "MCA-03", status: "Available" },
            { date: "Mar 27, 2026", time: "2:00 PM - 2:30 PM", lab_id: "mac-lab-a", station: "MCA-04", status: "Available" },
            { date: "Mar 27, 2026", time: "3:00 PM - 4:30 PM", lab_id: "mac-lab-a", station: "MCA-04", status: "Reserved", username: "linus", is_anonymous: true },

            // Lab C Slots 
            { date: "Mar 28, 2026", time: "12:00 PM - 1:00 PM", lab_id: "lab-c", station: "EPC-01", status: "Reserved", username: "felix" },
            { date: "Mar 28, 2026", time: "2:00 PM - 3:00 PM", lab_id: "lab-c", station: "EPC-02", status: "Available" },
            { date: "Mar 28, 2026", time: "3:00 PM - 4:00 PM", lab_id: "lab-c", station: "EPC-03", status: "Available" },
            { date: "Mar 28, 2026", time: "4:00 PM - 4:30 PM", lab_id: "lab-c", station: "EPC-04", status: "Reserved", username: "mark", is_anonymous: true},
            { date: "Mar 28, 2026", time: "5:30 PM - 6:00 PM", lab_id: "lab-c", station: "EPC-04", status: "Available" },

            //Mac Lab B slots
            { date: "Mar 29, 2026", time: "4:00 PM - 5:00 PM", lab_id: "mac-lab-b", station: "MCB-01", status: "Reserved", username: "mark" },
            { date: "Mar 29, 2026", time: "4:00 PM - 5:00 PM", lab_id: "mac-lab-b", station: "MCB-02", status: "Available"},
            { date: "Mar 29, 2026", time: "6:00 PM - 7:00 PM", lab_id: "mac-lab-b", station: "MCB-03", status: "Reserved", username: "linus" },
            { date: "Mar 29, 2026", time: "8:00 PM - 8:30 PM", lab_id: "mac-lab-b", station: "MCB-04", status: "Available" }, 
            { date: "Mar 29, 2026", time: "9:00 PM - 9:30 PM", lab_id: "mac-lab-b", station: "MCB-04", status: "Available" }, 

        ]);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
});