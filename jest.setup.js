import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";
import dotenv from "dotenv";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

dotenv.config({ path: ".env.test.local" });



