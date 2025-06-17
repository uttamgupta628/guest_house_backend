import { Router } from "express";
import { register, login } from "../controller/user.controller.js";
import { createRoom , getallRoom} from "../controller/room.controller.js";
// import { addGuest, getGuestsForUser } from "../controller/guest.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import multer from "multer";
// import { createBooking, getBookingsForUser } from "../controller/Booking.controller.js";
import { createBooking,getBookingsForUser } from "../controller/Booking.controller.js";

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

export default router;
