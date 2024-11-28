import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; 
import { prisma } from "./db.config.js";
import { Strategy as NaverStrategy } from "passport-naver-v2";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/callback/google",
    scope: ["email", "profile"],
    state: true,
  },
  (accessToken, refreshToken, profile, cb) => {
    return googleVerify(profile)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
);

const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error(`profile.email was not found: ${profile}`);
    }
  
    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
      return { id: user.id, email: user.email, name: user.name };
    }
  
    const created = await prisma.user.create({
      data: {
        email,
        name: profile.displayName,
        gender: "M",
        birth: new Date(1970, 0, 1),
        address: "추후 수정",
      },
    });
  
    return { id: created.id, email: created.email, name: created.name };
  };


  export const naverStrategy = new NaverStrategy(
    {
      clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
      clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/oauth2/callback/naver",
      scope: ["name", "email"],
      state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
      return naverVerify(profile)
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    }
  );

  const naverVerify = async (profile) => {
    const email = profile.email;
    if (!email) {
      throw new Error(`profile.email was not found: ${profile}`);
    }
  
    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
      return { id: user.id, email: user.email, name: user.name };
    }
  
    const created = await prisma.user.create({
      data: {
        email,
        name: profile.name,
        gender: "M",
        birth: new Date(1970, 0, 1),
        address: "추후 수정",
      },
    });
  
    return { id: created.id, email: created.email, name: created.name };
  };