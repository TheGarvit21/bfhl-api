const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bfhlRoutes = require("./routes/bfhlRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/", bfhlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in production structure on port ${PORT}`);
});
