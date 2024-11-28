import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { getUserPreferencesByUserId } from "../repositories/user.repository.js";
import { postReview } from "../services/user.service.js"; // 수정하기
import { missionAdd } from "../services/user.service.js";
import { changeStatus } from "../services/user.service.js";
import { listStoreReviews } from "../services/user.service.js";
import { changeUserStatus } from "../services/user.service.js";
import { listStoreMissions } from "../services/user.service.js";
import { specificReviews } from "../services/user.service.js";
import { userUpdate } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" },
              gender: { type: "string" },
              birth: { type: "string", format: "date" },
              address: { type: "string" },
              preferredFoodId: { type: "number" },
              phone_certification: { type: "number" }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));

  const preferences = await getUserPreferencesByUserId(user.id); // 필요한 경우 선호도 가져오기
  const response = responseFromUser(req.body, preferences);
  res.status(StatusCodes.OK).success(response);
};

export const handleUserReview = async (req, res, next) => {
  /*
    #swagger.summary = '가게 리뷰 작성 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: { type: "number", example: 1 },
              store_id: { type: "number", example: 1 },
              content: { type: "string" },
              star_count: { type: "number", example: 5 }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "리뷰 작성 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  review_id: { type: "number", example: 1},
                  store_id: { type: "number", example: 1 },
                  user_id: { type: "number", example: 1 },
                  content: { type: "string" },
                  star_count: { type: "number", example: 5}
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "리뷰 작성 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "SC001" },
                  reason: { type: "string" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          },
          example: {
          resultType: "FAIL",
          error: {
            errorCode: "SC001",
            reason: "별점이 올바르지 않습니다.",
            data: { 
            store_id: 100,
            user_id: 1,
            content: "ffff",
            star_count: 0 
            }
          },
          success: null
         }
        }
      }
    };
  */
  console.log("리뷰 작성 성공!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const review = await postReview(bodyToUser(req.body)); // 위에 따라서 수정하기  
  console.log(review)
  res.status(StatusCodes.OK).success({ result: review });
};

export const handleUserAddMission = async (req, res, next) => {
  /*
    #swagger.summary = '가게 미션 추가 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              store_id: { type: "number", example: 1 },
              status: { type: "string", example: "ON" },
              review_existence: { type: "boolean", example: false }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "미션 추가 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  mission_id: { type: "number", example: 1},
                  store_id: { type: "number", example: 1 },
                  status: { type: "string", example: "ON" },
                  review_existence: { type: "boolean", example: false }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "미션 추가 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "SN001" },
                  reason: { type: "string" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          },
          example: {
          resultType: "FAIL",
          error: {
            errorCode: "SN001",
            reason: "존재하지 않는 식당입니다.",
            data: { 
            store_id: 100,
            status: "ON",
            review_existence: false
            }
          },
          success: null
         }
        }
      }
    };
  */
  console.log("미션이 추가되었습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const mission = await missionAdd(bodyToUser(req.body));
  res.status(StatusCodes.OK).success({ result: mission });
};

export const handleChangeStatus = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전하기 API';
    #swagger.responses[200] = {
    description: "미션 도전 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  mission_id: { type: "number", example: 1 },
                  store_id: { type: "number", example: 1 },
                  status: { type: "string", example: "ON" },
                  review_existence: { type: "boolean", example: false },
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "미션 도전 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "MN001" },
                  reason: { type: "string" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          },
          example: {
          resultType: "FAIL",
          error: {
            errorCode: "MN001",
            reason: "존재하지 않는 미션입니다.",
            data: { 
            mission_id: 2
            }
          },
          success: null
         }
        }
      }
    };
  */
  console.log("미션이 도전 중입니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const mission = await changeStatus(
    parseInt(req.params.missionId)
  );
  res.status(StatusCodes.OK).success({ result: mission });
};

export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                        content: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
    */
  const reviews = await listStoreReviews(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};

export const handleChangeUserStatus = async (req, res, next) => {
  /*
    #swagger.summary = '특정 사용자 미션 상태 변경 API';
    #swagger.responses[200] = {
    description: "미션 상태 변경 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  mission_id: { type: "number", example: 1 },
                  store_id: { type: "number", example: 1 },
                  user_id: { type: "number", example: 1 },
                  status: { type: "string", example: "complete" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "미션 상태 변경 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "UN001" },
                  reason: { type: "string" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          },
          example: {
          resultType: "FAIL",
          error: {
            errorCode: "UN001",
            reason: "존재하지 않는 사용자입니다.",
            data: { 
            user_id: 100
            }
          },
          success: null
         }
        }
      }
    };
  */
  console.log("미션 진행상황이 변경되었습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const mission = await changeUserStatus(
    parseInt(req.params.userId),
    parseInt(req.params.missionId)
  );
  res.status(StatusCodes.OK).success({ result: mission });
};

export const handleListStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = '특정 가게의 미션 목록 조회 API';
    #swagger.responses[200] = {
      description: "미션 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1 },
                        store_id: { type: "number", example: 1 },
                        status: { type: "string", example: "ON" },
                        review_existence: { type: "boolean", example: false }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "미션 목록 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "SN001" },
                  reason: { type: "string" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          },
          example: {
          resultType: "FAIL",
          error: {
            errorCode: "SN001",
            reason: "존재하지 않는 식당입니다.",
            data: { 
            store_id: 79
            }
          },
          success: null
         }
        }
      }
    };
  */
  const missions = await listStoreMissions(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(missions);
};

export const handleUserSpecificReview = async (req, res, next) => {
  /*
    #swagger.summary = '특정 사용자의 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        review_id: { type: "number", example: 1 },
                        content: { type: "number", example: 1 },
                        store_id: { type: "string", example: "ON" },
                        store: { type: "boolean", example: false },
                        user_id: { type: "number", example: 1},
                        star_count: { type: "number", example: 5}
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "리뷰 목록 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "SN001" },
                  reason: { type: "string" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          },
          example: {
          resultType: "FAIL",
          error: {
            errorCode: "UN001",
            reason: "존재하지 않는 사용자입니다.",
            data: { 
            user_id: 100
            }
          },
          success: null
         }
        }
      }
    };
  */
  const reviews = await specificReviews(
    parseInt(req.params.userId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};


export const handleUpdateUserInfo = async (req, res, next) => {
  console.log("사용자 정보 수정을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const userId = req.params.userId
  const updatedInfo = req.body

  const updatedUser = await userUpdate(userId, updatedInfo)

  // 성공 시 응답
  res.status(StatusCodes.OK).json({
    resultType: "SUCCESS",
    success: updatedUser,
    error: null,
  }) 
};