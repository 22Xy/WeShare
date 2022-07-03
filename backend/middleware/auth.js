import jwt, { decode } from "jsonwebtoken";

// wants to like a post
// click the button => auth middleware (NEXT) => like post controller ...

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isGoogleAuth = token.length >= 500;

    let decodedData;
    if (token && !isGoogleAuth) {
      // 'test' the secret we used for creating the token before.
      // it has to be the same secret
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      // sub acts like an id for each google user
      req.userId = decodedData?.sub;
    }
    // do next operation
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
