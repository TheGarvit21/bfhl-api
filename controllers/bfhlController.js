const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getFibonacci, isPrime, gcd, lcmTwo } = require("../utils/mathUtils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const EMAIL = process.env.OFFICIAL_EMAIL;

exports.getHealth = (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: EMAIL,
    });
};

exports.processBfhl = async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);

        if (keys.length !== 1) {
            return res.status(400).json({
                is_success: false,
                message: "Request must contain exactly one valid operation key",
            });
        }

        const key = keys[0];
        let result;

        switch (key) {
            case "fibonacci":
                if (typeof body.fibonacci !== 'number' || body.fibonacci < 0) {
                    return res.status(400).json({ is_success: false, message: "Invalid input for fibonacci" });
                }
                result = getFibonacci(body.fibonacci);
                break;

            case "prime":
                if (!Array.isArray(body.prime)) {
                    return res.status(400).json({ is_success: false, message: "Input must be an array for prime check" });
                }
                const primesOnly = body.prime.filter(n => typeof n === 'number' && Number.isInteger(n));
                result = primesOnly.filter(isPrime);
                break;

            case "lcm":
                if (!Array.isArray(body.lcm) || body.lcm.length < 2) {
                    return res.status(400).json({ is_success: false, message: "Input must be an array of at least 2 numbers for lcm" });
                }
                if (body.lcm.some(n => typeof n !== 'number' || !Number.isInteger(n))) {
                    return res.status(400).json({ is_success: false, message: "All elements in lcm array must be integers" });
                }
                result = body.lcm.reduce((a, b) => lcmTwo(a, b));
                break;

            case "hcf":
                if (!Array.isArray(body.hcf) || body.hcf.length < 2) {
                    return res.status(400).json({ is_success: false, message: "Input must be an array of at least 2 numbers for hcf" });
                }
                if (body.hcf.some(n => typeof n !== 'number' || !Number.isInteger(n))) {
                    return res.status(400).json({ is_success: false, message: "All elements in hcf array must be integers" });
                }
                result = body.hcf.reduce((a, b) => gcd(a, b));
                break;

            case "AI":
                if (typeof body.AI !== 'string') {
                    return res.status(400).json({ is_success: false, message: "AI query must be a valid string" });
                }
                const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
                try {
                    const aiResponse = await model.generateContent(body.AI + " (Answer in exactly one word)");
                    const text = aiResponse.response.text();
                    result = text.trim().split(/\s+/)[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                } catch (aiErr) {
                    return res.status(500).json({ is_success: false, message: "AI provider integration error" });
                }
                break;

            default:
                return res.status(400).json({ is_success: false, message: "Unsupported operation" });
        }

        res.json({
            is_success: true,
            official_email: EMAIL,
            data: result,
        });

    } catch (err) {
        res.status(500).json({
            is_success: false,
            message: "Internal server error",
        });
    }
};
