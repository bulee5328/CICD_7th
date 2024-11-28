import { responseFromUser } from "../dtos/user.dto.js";
import { responseFromMission } from "../dtos/user.dto.js";
import { responseFromReview } from "../dtos/user.dto.js";
import { responseFromUserMission } from "../dtos/user.dto.js";
import { responseFromSpecificMission } from "../dtos/user.dto.js";
import { responseFromSpecificReview } from "../dtos/user.dto.js";
import { responseFromUserUpdate } from "../dtos/user.dto.js";
import { DuplicateUserEmailError, StoreNotFoundError, MissionNotFoundError, UserNotFoundError, StarCountNotMatchError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  addPreferredFood,
  isPreferredFoodExist,
  addMission,
  getMission,
  updateMissionStatus,
  addReview,
  getReview,
  getAllStoreReviews,
  addStore,
  addStoreReview,
  updateUserMissionStatus,
  getSpecificMissions,
  getSpecificUserReviews,
  updateUserInfo
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {

  // 사용자 추가
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    phone_certification: data.phone_certification,
  });

  // 이메일 중복 확인
  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  // 선호 음식의 존재 여부 확인
  const foodExists = await isPreferredFoodExist(data.preferredFoodId);

  // 선호 음식이 존재하지 않으면 추가
  if (!foodExists) {
    const newFoodId = await addPreferredFood(data.category);
    
    // 새로 추가된 음식 ID를 사용하여 선호도 설정
    await setPreference(joinUserId, newFoodId);
  } else {
    // 존재하는 음식 ID일 경우 선호도 설정
    await setPreference(joinUserId, data.preferredFoodId);
  }

  // 사용자 정보 및 선호 음식 가져오기
  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};
  
export const postReview = async (data) => {
  const joinReviewId = await addReview({
    store_id: data.storeId,
    user_id: data.userId,
    content: data.content,
    starCount: data.starCount,
  });

  // 별점 기반 오류 탐색
  if (data.starCount<1 || data.starCount>5) {
    throw new StarCountNotMatchError("별점이 올바르지 않습니다.", 
      {store_id: data.storeId,
      user_id: data.userId,
      content: data.content,
      starCount: data.starCount,});
  }

  const review = await getReview(joinReviewId);
  //

  return responseFromReview(review); // user 부분 수정하기
};


export const missionAdd = async (data) => {
  const joinMissionId = await addMission({
    storeId: data.storeId,
    userId: data.userId,
    status: data.status,
    reviewExistence: data.reviewExistence || false,
  });

  // id 기반 존재하는 식당 탐색
  if (joinMissionId === null) {
    throw new StoreNotFoundError("존재하지 않는 식당입니다.", 
      {store_id: data.storeId,
        status: data.status,
        reviewExistence: data.reviewExistence || false,}
    );
  }

  const mission = await getMission(joinMissionId);
  //
  
  return responseFromMission(mission);
};

// 미션 상태 변경(미션 도전)
export const changeStatus = async (joinMissionId) => {
  const newStatus = "ON"

  if (joinMissionId === null) {
    throw new MissionNotFoundError("존재하지 않는 미션입니다.", {missionId: joinMissionId});
  }

  await updateMissionStatus(joinMissionId, newStatus)

  const mission = await getMission(joinMissionId);

  return responseFromMission(mission);
};

// 리뷰 목록 API
export const listStoreReviews = async (storeId, cursor) => {
  const review = await getAllStoreReviews(storeId, cursor);
  return responseFromReview(review);
};

const storeId = await addStore("New Store");
addStoreReview(storeId, 1, "very good");

const storeId2 = await addStore("New Store2");
addStoreReview(storeId2, 2, "very good2");

// 특정 사용자 미션 상태 변경(미션 도전)
export const changeUserStatus = async (userId, missionId) => {
  const newStatus = "complete"

  await updateUserMissionStatus(userId, missionId, newStatus)

  const userMission = await getMission(missionId);

  return responseFromUserMission(userMission);
};

// 특정 가게의 미션 목록
export const listStoreMissions = async (storeId, cursor) => {
  const mission = await getSpecificMissions(storeId, cursor);

  return responseFromSpecificMission(mission);
  
};

// 특정 사용자 리뷰 목록
export const specificReviews = async (userId, cursor) => {
  const specificReview = await getSpecificUserReviews(userId, cursor);

  return responseFromSpecificReview({ specificReview });
};

// 특정 사용자 정보 수정
export const userUpdate = async (userId, updateData) => {
  const updateUser = await updateUserInfo(userId, updateData)

  return responseFromUserUpdate({ updateUser });
};