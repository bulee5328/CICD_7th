import { pool } from "../db.config.js";
import { prisma } from "../db.config.js";
import { UserNotFoundError, StoreNotFoundError, MissionNotFoundError } from "../errors.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (user) {
    return null;
  }

  const created = await prisma.user.create({ data: data });
  return created.id;
};

// Review 데이터 삽입
export const addReview = async (data) => {
  const store = await prisma.store.findFirst({
    where: { id: data.store_id },
  });
  const user = await prisma.user.findFirst({
    where: { id: data.id }
  });

  // store 객체에서 id 값을 정수형으로 추출
  const storeId = store ? store.id : null;
  // user 객체에서 id 값을 정수형으로 추출
  const userId = user ? user.id : null;

  const created = await prisma.userStoreReview.create({
    data: {
      store: { connect: { id: storeId } },
      user: { connect: { id: userId } },
      content: data.content,
      starCount: data.starCount,
    },
  });

  return created.id;
}

// Mission 데이터 삽입
export const addMission = async (data) => {
  const store = await prisma.store.findFirst({
    where: { id: data.storeId },
  });

  if (!store) {
    return null;
  }

  const created = await prisma.mission.create({
    data: {
      store: { connect: { id: store.id } },
      status: data.status,
      reviewExistence: data.reviewExistence,
    },
  });

  return created.id;
}

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, preferredFoodId) => {
  await prisma.userPreferredFood.create({
    data: {
      user: { connect: { id: userId } }, // 사용자 연결 정보 추가
      preferredFood: { connect: { id: preferredFoodId } }, // 선호 음식 연결 정보 추가
    },
  });
};

// 음식 카테고리 추가
export const addPreferredFood = async (category) => {
  const createdFood = await prisma.preferredFood.create({
    data: {
      category: category
    }
  })
  return createdFood.id; // 생성된 선호 음식 ID 반환
};

// preferred_food 존재 여부 확인
export const isPreferredFoodExist = async (foodId) => {
  const result = await prisma.preferredFood.findUnique({
    where: { id: foodId },
    select: { id: true }, // id만 확인하여 존재 여부를 판단
  });

  return result !== null; // 존재하면 true, 아니면 false 반환
};


// Mission 상태 변경
export const updateMissionStatus = async (missionId, newStatus) => {
  try {
    // missionId에 해당하는 Mission의 status를 변경
    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: { status: newStatus },
    });

    // 성공적으로 업데이트되었음을 알리기 위해 업데이트된 missionId 반환
    return updatedMission.id;
  } catch (error) {
    console.error("Mission 상태 업데이트 오류:", error);
    return null;
  }
};


// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.userPreferredFood.findMany({
    select: {
      id: true,
      userId: true,
      preferredFoodId: true,
      preferredFood: true,
    },
    where: { userId: userId },
    orderBy: { preferredFoodId: "asc" },
  });

  return preferences;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
  return user;
};


// 리뷰 정보 얻기
export const getReview = async (reviewId) => {
  const review = await prisma.userStoreReview.findFirstOrThrow({ where: { id: reviewId } });
  return review;
};


// 미션 정보 얻기
export const getMission = async (missionId) => {
  const mission = await prisma.mission.findFirstOrThrow({ where: { id: missionId } });
  return mission;
};

// 모든 가게 리뷰 가져오기
export const getAllStoreReviews = async (storeId, cursor) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true,
      content: true,
      storeId: true,
      userId: true,
      store: true,
      user: true,
    },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};

// 목록 API 테스트를 위함
// 새로운 Store 추가 함수
export async function addStore(storeName) {
  const newStore = await prisma.store.create({
    data: {
      name: storeName,
    },
  });
  return newStore.id; // 생성된 store의 ID를 반환
}

// 특정 Store에 리뷰 추가 함수
export async function addStoreReview(storeId, userId, reviewContent) {
  const newReview = await prisma.userStoreReview.create({
    data: {
      storeId: storeId,         // addStore로 생성된 store의 ID
      userId: userId,
      content: reviewContent,
    },
  });
}

// 특정 사용자 Mission 상태 변경
export const updateUserMissionStatus = async (userId, missionId, newStatus) => {
  try {
    const user = await prisma.mission.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new UserNotFoundError("존재하지 않는 사용자입니다.", userId);
    }

    const mission = await prisma.mission.findFirst({
      where: { id: missionId },
    });
    if (!mission) {
      throw new MissionNotFoundError("존재하지 않는 미션입니다.", missionId);
    }

    // missionId에 해당하는 Mission의 status를 변경
    const updatedMission = await prisma.mission.update({
      where: {
        id: missionId,
        userId: userId,
      },
      data: { status: newStatus },
    });

    // 성공적으로 업데이트되었음을 알리기 위해 업데이트된 missionId 반환
    return updatedMission.id;
  } catch (error) {
    console.error("Mission 상태 업데이트 오류:", error);
    return null;
  }
};

// 특정 가게 미션 가져오기
export const getSpecificMissions = async (storeId, cursor) => {
  const store = await prisma.mission.findFirst({
    where: { id: storeId },
  });

  if (!store) {
    throw new StoreNotFoundError("존재하지 않는 식당입니다.", storeId);
  }

  const missions = await prisma.mission.findMany({
    select: {
      id: true,
      store: {
        select: { id: true }
      },
      status: true,
      reviewExistence: true,
    },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return missions;
};

// 특정 사용자 리뷰 가져오기
export const getSpecificUserReviews = async (userId, cursor) => {
  const user = await prisma.mission.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", userId);
  }

  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true,
      content: true,
      storeId: true,
      store: {
        select: { name: true },
      },
      user: {
        select: { id: true },
      },
      starCount: true
    },
    where: { userId: userId, id: { gt: cursor } },
    orderBy: { starCount: "asc" },
    take: 5,
  });

  return reviews;
};

// 특정 사용자 정보 수정하기
export const updateUserInfo = async (userId, updateData) => {
  const updateUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: updateData
  });

  return updateUser;
};
