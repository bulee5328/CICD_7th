export const bodyToUser = (body) => {
  const birth = new Date("2000-02-03");

  return {
    id: body.id,
    status: body.status,
    reviewExistence: body.reviewExistence,
    email: body.email,
    name: body.name,
    gender: body.gender,
    birth,
    address: body.address || "",
    preferredFoodId: body.preferredFoodId,
    phone_certification: body.phone_certification,
    userId: body.userId,
    storeId: body.storeId,
    content: body.content,
    starCount: body.starCount,
  };
};

export const responseFromUser = (body, preferences) => {
  const birth = new Date(body.birth);

  return {
    id: body.id,
    storeId: body.storeId,
    status: body.status,
    reviewExistence: body.reviewExistence,
    email: body.email,
    name: body.name,
    gender: body.gender,
    birth,
    address: body.address || "",
    preferredFoodId: body.preferredFoodId,
    phone_certification: body.phone_certification,
  };
};

export const responseFromMission = (body) => {
  return {
    id: body.id,
    storeId: body.storeId,
    status: body.status,
    reviewExistence: body.reviewExistence,
  }
}

export const responseFromReview = (review) => {
  return {
    data: review,
    pagination: {
      cursor: review.length ? review[review.length - 1].id : null,
    },
  };
};

export const responseFromSpecificMission = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};

export const responseFromUserMission = (body) => {
  return {
    id: body.id,
    storeId: body.storeId,
    userId: body.userId,
    status: body.status,
  }
}

export const responseFromSpecificReview = (review) => {
  return {
    data: review,
  };
};

export const responseFromUserUpdate = (updateUser) => {
  return {
    data: updateUser,
  };
};