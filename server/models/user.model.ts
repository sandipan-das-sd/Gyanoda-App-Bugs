require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//for validation og email need RegExp
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegexPattern: RegExp = /^\+?[1-9]\d{1,14}$/;

export interface IUser extends Document {
  _id:string,
  name: string;
  email: string;
  phone: string,
  location:string,
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    phone: {
            type: String,
            unique: true,
            required: [true, "Please enter your mobile no"],
            validate: {
              validator: function (value: string) {
                return phoneRegexPattern.test(value);
              },
              message: "Please enter a valid mobile number",
            },
          },
    location: {
      type: String,
    },
    password: {
      type: String,
      
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);
userSchema.index({ phone: 1 }, { unique: true });

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("phone")) {
    let cleanPhone = this.phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
      this.phone = "+91" + cleanPhone;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
      this.phone = "+" + cleanPhone;
    }
  }
  
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  next();
});


// Hash Password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "1d",
  });
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;


//mobole no validation db
// require("dotenv").config();
// import mongoose, { Document, Model, Schema } from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const phoneRegexPattern: RegExp = /^\+?[1-9]\d{1,14}$/;

// export interface IUser extends Document {
//   _id: string,
//   name: string;
//   email: string;
//   phone: string,
//   location: string,
//   password: string;
//   avatar: {
//     public_id: string;
//     url: string;
//   };
//   role: string;
//   isVerified: boolean;
//   courses: Array<{ courseId: string }>;
//   comparePassword: (password: string) => Promise<boolean>;
//   SignAccessToken: () => string;
//   SignRefreshToken: () => string;
// }

// const userSchema: Schema<IUser> = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please enter your name"],
//       maxlength: [30, "Your name cannot exceed 30 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please enter your email"],
//       validate: {
//         validator: function (value: string) {
//           return emailRegexPattern.test(value);
//         },
//         message: "Please enter a valid email",
//       },
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       unique: true,
//       required: [true, "Please enter your mobile no"],
//       validate: {
//         validator: function (value: string) {
//           return phoneRegexPattern.test(value);
//         },
//         message: "Please enter a valid mobile number",
//       },
//     },
//     location: {
//       type: String,
//     },
//     password: {
//       type: String,
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false,
//     },
//     avatar: {
//       public_id: String,
//       url: String,
//     },
//     role: {
//       type: String,
//       default: "user",
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     courses: [
//       {
//         courseId: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// userSchema.index({ phone: 1 }, { unique: true });

// userSchema.pre<IUser>("save", async function (next) {
//   if (this.isModified("phone")) {
//     let cleanPhone = this.phone.replace(/\D/g, '');
    
//     if (cleanPhone.length === 10) {
//       this.phone = "+91" + cleanPhone;
//     } else if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
//       this.phone = "+" + cleanPhone;
//     }
//   }
  
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
  
//   next();
// });

// userSchema.methods.SignAccessToken = function () {
//   return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
//     expiresIn: "1d",
//   });
// };

// userSchema.methods.SignRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
//     expiresIn: "3d",
//   });
// };

// userSchema.methods.comparePassword = async function (
//   enteredPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const userModel: Model<IUser> = mongoose.model("User", userSchema);

// export default userModel;