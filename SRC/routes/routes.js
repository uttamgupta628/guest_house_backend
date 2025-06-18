import { Router } from "express";
import { register, login } from "../controller/user.controller.js";
import { createRoom , getallRoom} from "../controller/room.controller.js";
// import { addGuest, getGuestsForUser } from "../controller/guest.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createBooking,getBookingsForUser } from "../controller/Booking.controller.js";
import { adminLogin ,updateRoomDetails, deleteRoom, updateBookingStatus, deleteBooking} from "../controller/admin.controller.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", upload.none(), register);
router.post("/login", upload.none(), login);
router.post("/rooms", upload.single("photo"), createRoom);
router.get('/allroom',upload.none(),getallRoom)

// router.post("/add", verifyJWT, addGuest);
// router.get("/my-guests", verifyJWT, upload.none(), getGuestsForUser);


router.post("/create", verifyJWT, upload.none(), createBooking);

router.get("/my-bookings", verifyJWT, upload.none(), getBookingsForUser);

// admin login
router.post("/admin-login", upload.none(),adminLogin)
router.put("/updateRoomDetails/:id",verifyAdminToken,upload.single("photo"),updateRoomDetails)
router.delete("/delete/:id",verifyAdminToken,upload.none(),deleteRoom)

router.put("/updateBooking/:id", verifyAdminToken, upload.none(),updateBookingStatus);

router.delete("/deleteBooking/:id", verifyAdminToken,upload.none(), deleteBooking);

export default router;
