const mathJs = require(ROOT_PATH + "/generics/helpers/mathFunctions");

module.exports = class Submission extends Abstract {
  /**
     * @apiDefine errorBody
     * @apiError {String} status 4XX,5XX
     * @apiError {String} message Error
     */

  /**
     * @apiDefine successBody
     *  @apiSuccess {String} status 200
     * @apiSuccess {String} result Data
     */


  constructor() {
    super(submissionsSchema);
  }

  static get name() {
    return "submissions";
  }

  async findSubmissionBySchoolProgram(document, requestObject) {

    let queryObject = {
      schoolId: document.schoolId,
      programId: document.programId
    };

    let submissionDocument = await database.models.submissions.findOne(
      queryObject
    );

    if (!submissionDocument) {
      let schoolAssessorsQueryObject = [
        {
          $match: { schools: document.schoolId, programId: document.programId }
        }
      ];

      document.assessors = await database.models[
        "schoolAssessors"
      ].aggregate(schoolAssessorsQueryObject);

      let assessorElement = document.assessors.find(assessor => assessor.userId === requestObject.userDetails.userId)
      if (assessorElement && assessorElement.externalId != "") {
        assessorElement.assessmentStatus = "started"
        assessorElement.userAgent = requestObject.headers['user-agent']
      }

      submissionDocument = await database.models.submissions.create(
        document
      );
    } else {
      let assessorElement = submissionDocument.assessors.find(assessor => assessor.userId === requestObject.userDetails.userId)
      if (assessorElement && assessorElement.externalId != "") {
        assessorElement.assessmentStatus = "started"
        assessorElement.userAgent = requestObject.headers['user-agent']
        let updateObject = {}
        updateObject.$set = {
          assessors: submissionDocument.assessors
        }
        submissionDocument = await database.models.submissions.findOneAndUpdate(
          queryObject,
          updateObject
        );
      }
    }

    return {
      message: "Submission found",
      result: submissionDocument
    };
  }

  /**
  * @api {post} /assessment/api/v1/submissions/make/{{submissionId}} 
  * @apiVersion 0.0.1
  * @apiName submissions added successfully
  * @apiGroup submissions
  * @apiParamExample {json} Request-Body:
  * {
  * 	"evidence": {
  *                   "externalId" : "",
  *                   "answers" : {
  *                       "5be442149a14ba4b5038dce4" : {
  *                           "qid" : "",
  *                           "responseType":"",
  *                           "value" : [ 
  *                               {
  *                                   "5be442dd9a14ba4b5038dce5" : {
  *                                       "qid" : "",
  *                                       "value" : "",
  *                                       "remarks" : "",
  *                                       "fileName" : [],
  *                                       "payload" : {
  *                                           "question" : [ 
  *                                               "", 
  *                                               ""
  *                                           ],
  *                                           "labels" : [ 
  *                                               ""
  *                                           ],
  *                                           "responseType" : ""
  *                                       },
  *                                       "criteriaId" : ""
  *                                   },
  *                                   "5be52f5d9a14ba4b5038dd0c" : {
  *                                       "qid" : "",
  *                                       "value" : [ 
  *                                           "String", 
  *                                           "String"
  *                                       ],
  *                                       "remarks" : "",
  *                                       "fileName" : [],
  *                                       "payload" : {
  *                                           "question" : [ 
  *                                               "", 
  *                                               ""
  *                                           ],
  *                                           "labels" : [ 
  *                                              "String", 
  *                                           "String"
  *                                           ],
  *                                           "responseType" : """
  *                                       },
  *                                       "criteriaId" : ""
  *                                   }
  *                               }
  *                           ],
  *                           "remarks" : "",
  *                           "fileName" : [],
  *                           "payload" : {
  *                               "question" : [ 
  *                                   "String"", 
  *                                   "Stgring"
  *                               ],
  *                              "labels" : [ 
  *                                   [ 
  *                                       [ 
  *                                           {
  *                                               "_id" : "",
  *                                               "question" : [ 
  *                                                   "String", 
  *                                                   "String"
  *                                               ],
  *                                               "options" : [ 
  *                                                   {
 *                                                       "value" : "",
 *                                                       "label" : ""
 *                                                   }
 *                                               ],
 *                                               "children" : [],
 *                                               "questionGroup" : [ 
 *                                                   ""
 *                                               ],
 *                                               "fileName" : [],
 *                                               "instanceQuestions" : [],
 *                                               "deleted" : Boolean,
 *                                               "tip" : "",
 *                                               "externalId" : "",
 *                                               "visibleIf" : "",
 *                                               "file" : "",
 *                                               "responseType" : "",
 *                                               "validation" : {
 *                                                   "required" : Boolean
 *                                               },
 *                                               "showRemarks" : Boolean,
 *                                               "isCompleted" : Boolean,
 *                                               "remarks" : "",
 *                                               "value" : "",
 *                                               "canBeNotApplicable" : "Boolean",
 *                                               "usedForScoring" : "",
 *                                               "modeOfCollection" : "",
 *                                               "questionType" : "",
 *                                               "accessibility" : "",
 *                                               "updatedAt" : "Date",
 *                                               "createdAt" : "Date",
 *                                               "__v" : 0,
 *                                               "payload" : {
 *                                                   "criteriaId" : ""
 *                                               }
 *                                           }, 
 *                                           {
 *                                               "_id" : "",
 *                                               "question" : [ 
 *                                                   "String", 
 *                                                   "String"
 *                                               ],
 *                                               "options" : [ 
 *                                                   {
 *                                                       "value" : "",
 *                                                       "label" : ""
 *                                                   }
 *                                               ],
 *                                               "children" : [],
 *                                               "questionGroup" : [ 
 *                                                   "String"
 *                                               ],
 *                                               "fileName" : [],
 *                                               "instanceQuestions" : [],
 *                                               "deleted" : Boolean,
 *                                               "tip" : "",
 *                                               "externalId" : "",
 *                                               "visibleIf" : "",
 *                                               "file" : "",
 *                                               "responseType" : "",
 *                                               "validation" : {
 *                                                   "required" : Boolean
 *                                               },
 *                                               "showRemarks" : Boolean,
 *                                               "isCompleted" : Boolean,
 *                                               "remarks" : "",
 *                                               "value" : "",
 *                                               "canBeNotApplicable" : "Boolean",
 *                                               "usedForScoring" : "",
 *                                               "modeOfCollection" : "",
 *                                               "questionType" : "",
 *                                               "accessibility" : "",
 *                                               "updatedAt" : "Date",
 *                                               "createdAt" : "Date",
 *                                               "__v" : 0,
 *                                               "payload" : {
 *                                                   "criteriaId" : ""
 *                                               }
 *                                           }
 *                                       ], 
 *                                   ]
 *                               ],
 *                               "responseType" : ""
 *                           },
 *                           "criteriaId" : ""
 *                       }
 *                   },
 *                   "startTime" : Date,
 *                   "endTime" : Date,
 *                   "gpsLocation" : "String,String",
 *                   "submittedBy" : """,
 *                   "isValid" : Boolean
 *               }
 * }
 * @apiUse successBody
 * @apiUse errorBody
  */

  async make(req) {
    return new Promise(async (resolve, reject) => {

      try {

        req.body = req.body || {};
        let message = "Submission completed successfully"
        let runUpdateQuery = false

        let queryObject = {
          _id: ObjectId(req.params._id)
        }

        let queryOptions = {
          new: true
        }

        let submissionDocument = await database.models.submissions.findOne(
          queryObject
        );

        let updateObject = {}
        let result = {}

        if (req.body.schoolProfile) {
          updateObject.$set = { schoolProfile: req.body.schoolProfile }
          runUpdateQuery = true
        }

        if (req.body.evidence) {
          req.body.evidence.gpsLocation = req.headers.gpslocation
          req.body.evidence.submittedBy = req.userDetails.userId
          req.body.evidence.submittedByName = req.userDetails.firstName + " " + req.userDetails.lastName
          req.body.evidence.submittedByEmail = req.userDetails.email
          req.body.evidence.submissionDate = new Date()

          let evidencesStatusToBeChanged = submissionDocument.evidencesStatus.find(singleEvidenceStatus => singleEvidenceStatus.externalId == req.body.evidence.externalId);
          if (submissionDocument.evidences[req.body.evidence.externalId].isSubmitted === false) {
            runUpdateQuery = true
            req.body.evidence.isValid = true
            let answerArray = {}
            Object.entries(req.body.evidence.answers).forEach(answer => {
              if (answer[1].responseType === "matrix" && answer[1].notApplicable != true) {
                if (answer[1].isAGeneralQuestion == true && submissionDocument.generalQuestions && submissionDocument.generalQuestions[answer[0]]) {
                  submissionDocument.generalQuestions[answer[0]].submissions.forEach(generalQuestionSubmission => {
                    generalQuestionSubmission.value.forEach(generalQuestionInstanceValue => {
                      generalQuestionInstanceValue.isAGeneralQuestionResponse = true
                      answer[1].value.push(generalQuestionInstanceValue)
                    })
                    generalQuestionSubmission.payload.labels[0].forEach(generalQuestionInstancePayload => {
                      answer[1].payload.labels[0].push(generalQuestionInstancePayload)
                    })
                  })
                }
                for (let countOfInstances = 0; countOfInstances < answer[1].value.length; countOfInstances++) {

                  _.valuesIn(answer[1].value[countOfInstances]).forEach(question => {

                    if (answerArray[question.qid]) {
                      answerArray[question.qid].instanceResponses.push(question.value)
                      answerArray[question.qid].instanceRemarks.push(question.remarks)
                      answerArray[question.qid].instanceFileName.push(question.fileName)
                    } else {
                      let clonedQuestion = { ...question }
                      clonedQuestion.instanceResponses = new Array
                      clonedQuestion.instanceRemarks = new Array
                      clonedQuestion.instanceFileName = new Array
                      clonedQuestion.instanceResponses.push(question.value)
                      clonedQuestion.instanceRemarks.push(question.remarks)
                      clonedQuestion.instanceFileName.push(question.fileName)
                      delete clonedQuestion.value
                      delete clonedQuestion.remarks
                      delete clonedQuestion.fileName
                      delete clonedQuestion.payload
                      answerArray[question.qid] = clonedQuestion
                    }

                  })
                }
                answer[1].countOfInstances = answer[1].value.length
              }
              answerArray[answer[0]] = answer[1]
            });

            if (answerArray.isAGeneralQuestionResponse) { delete answerArray.isAGeneralQuestionResponse }


            evidencesStatusToBeChanged['isSubmitted'] = true;
            evidencesStatusToBeChanged['notApplicable'] = req.body.evidence.notApplicable;
            evidencesStatusToBeChanged['startTime'] = req.body.evidence.startTime;
            evidencesStatusToBeChanged['endTime'] = req.body.evidence.endTime;
            evidencesStatusToBeChanged['hasConflicts'] = false;
            evidencesStatusToBeChanged['submissions'].push(_.omit(req.body.evidence, "answers"));

            updateObject.$push = {
              ["evidences." + req.body.evidence.externalId + ".submissions"]: req.body.evidence
            }
            updateObject.$set = {
              answers: _.assignIn(submissionDocument.answers, answerArray),
              ["evidences." + req.body.evidence.externalId + ".isSubmitted"]: true,
              ["evidences." + req.body.evidence.externalId + ".notApplicable"]: req.body.evidence.notApplicable,
              ["evidences." + req.body.evidence.externalId + ".startTime"]: req.body.evidence.startTime,
              ["evidences." + req.body.evidence.externalId + ".endTime"]: req.body.evidence.endTime,
              ["evidences." + req.body.evidence.externalId + ".hasConflicts"]: false,
              evidencesStatus: submissionDocument.evidencesStatus,
              status: (submissionDocument.status === "started") ? "inprogress" : submissionDocument.status
            }
          } else {
            runUpdateQuery = true
            req.body.evidence.isValid = false

            Object.entries(req.body.evidence.answers).forEach(answer => {
              if (answer[1].responseType === "matrix" && answer[1].notApplicable != true) {
                if (answer[1].isAGeneralQuestion == true && submissionDocument.generalQuestions && submissionDocument.generalQuestions[answer[0]]) {
                  submissionDocument.generalQuestions[answer[0]].submissions.forEach(generalQuestionSubmission => {
                    generalQuestionSubmission.value.forEach(generalQuestionInstanceValue => {
                      generalQuestionInstanceValue.isAGeneralQuestionResponse = true
                      answer[1].value.push(generalQuestionInstanceValue)
                    })
                    generalQuestionSubmission.payload.labels[0].forEach(generalQuestionInstancePayload => {
                      answer[1].payload.labels[0].push(generalQuestionInstancePayload)
                    })
                  })
                }
                answer[1].countOfInstances = answer[1].value.length
              }
            });

            updateObject.$push = {
              ["evidences." + req.body.evidence.externalId + ".submissions"]: req.body.evidence
            }

            evidencesStatusToBeChanged['hasConflicts'] = true;
            evidencesStatusToBeChanged['submissions'].push(_.omit(req.body.evidence, "answers"));

            updateObject.$set = {
              evidencesStatus: submissionDocument.evidencesStatus,
              ["evidences." + req.body.evidence.externalId + ".hasConflicts"]: true,
              status: (submissionDocument.ratingOfManualCriteriaEnabled === true) ? "inprogress" : "blocked"
            }

            message = "Duplicate evidence method submission detected."
          }

        }

        if (runUpdateQuery) {
          let updatedSubmissionDocument = await database.models.submissions.findOneAndUpdate(
            queryObject,
            updateObject,
            queryOptions
          );

          let canRatingsBeEnabled = await this.canEnableRatingQuestionsOfSubmission(updatedSubmissionDocument)
          let { ratingsEnabled } = canRatingsBeEnabled

          if (ratingsEnabled) {
            updateObject.$set = {
              status: "completed",
              completedDate: new Date()
            }
            updatedSubmissionDocument = await database.models.submissions.findOneAndUpdate(
              queryObject,
              updateObject,
              queryOptions
            );
          }

          let status = await this.extractStatusOfSubmission(updatedSubmissionDocument)

          let response = {
            message: message,
            result: status
          };

          return resolve(response);

        } else {

          let response = {
            message: message
          };

          return resolve(response);
        }

      } catch (error) {
        return reject({
          status: 500,
          message: "Oops! Something went wrong!",
          errorObject: error
        });
      }

    })
  }

  /**
* @api {post} /assessment/api/v1/submissions/completeParentInterview/:submissionId Complete parent interview
* @apiVersion 0.0.1
* @apiName Complete Parent Interview
* @apiSampleRequest /assessment/api/v1/submissions/completeParentInterview/5c5147ae95743c5718445eff
* @apiGroup submissions
* @apiUse successBody
* @apiUse errorBody
*/

  async completeParentInterview(req) {
    return new Promise(async (resolve, reject) => {

      try {

        req.body = req.body || {};
        let message = "Parent Interview completed successfully."
        const parentInterviewEvidenceMethod = "PAI"
        let runUpdateQuery = false

        let queryObject = {
          _id: ObjectId(req.params._id)
        }

        let queryOptions = {
          new: true
        }

        let submissionDocument = await database.models.submissions.findOne(
          queryObject
        );

        let updateObject = {}
        updateObject.$set = {}


        let schoolQueryObject = {
          _id: ObjectId(submissionDocument.schoolId)
        }

        let schoolDocument = await database.models.schools.findOne(
          schoolQueryObject
        );

        let schoolUpdatedDocument = {};

        let updateSchoolObject = {}

        updateSchoolObject.$set = {}

        let evidencesStatusToBeChanged = submissionDocument.evidencesStatus.find(singleEvidenceStatus => singleEvidenceStatus.externalId == parentInterviewEvidenceMethod);

        if (submissionDocument && (submissionDocument.evidences[parentInterviewEvidenceMethod].isSubmitted != true)) {
          let evidenceSubmission = {}
          evidenceSubmission.externalId = parentInterviewEvidenceMethod
          evidenceSubmission.submittedBy = req.userDetails.userId
          evidenceSubmission.submittedByName = req.userDetails.name
          evidenceSubmission.submittedByEmail = req.userDetails.email
          evidenceSubmission.submissionDate = new Date()
          evidenceSubmission.gpsLocation = "web"
          evidenceSubmission.isValid = true

          let evidenceSubmissionAnswerArray = {}




          Object.entries(submissionDocument.parentInterviewResponses).forEach(parentInterviewResponse => {
            if (parentInterviewResponse[1].status === "completed") {
              Object.entries(parentInterviewResponse[1].answers).forEach(answer => {
                if (evidenceSubmissionAnswerArray[answer[0]]) {
                  answer[1].value.forEach(instanceResponse => {
                    evidenceSubmissionAnswerArray[answer[0]].value.push(instanceResponse)
                  })
                  answer[1].payload.labels[0].forEach(instanceResponsePayload => {
                    evidenceSubmissionAnswerArray[answer[0]].payload.labels[0].push(instanceResponsePayload)
                  })
                  evidenceSubmissionAnswerArray[answer[0]].countOfInstances = evidenceSubmissionAnswerArray[answer[0]].value.length
                } else {
                  evidenceSubmissionAnswerArray[answer[0]] = answer[1]
                }
              })
            }
          });

          evidenceSubmission.answers = evidenceSubmissionAnswerArray

          if (Object.keys(evidenceSubmission.answers).length > 0) {
            runUpdateQuery = true
          }

          let answerArray = {}
          Object.entries(evidenceSubmission.answers).forEach(answer => {
            if (answer[1].responseType === "matrix") {

              for (let countOfInstances = 0; countOfInstances < answer[1].value.length; countOfInstances++) {

                _.valuesIn(answer[1].value[countOfInstances]).forEach(question => {

                  if (answerArray[question.qid]) {
                    answerArray[question.qid].instanceResponses.push(question.value)
                    answerArray[question.qid].instanceRemarks.push(question.remarks)
                    answerArray[question.qid].instanceFileName.push(question.fileName)
                  } else {
                    let clonedQuestion = { ...question }
                    clonedQuestion.instanceResponses = new Array
                    clonedQuestion.instanceRemarks = new Array
                    clonedQuestion.instanceFileName = new Array
                    clonedQuestion.instanceResponses.push(question.value)
                    clonedQuestion.instanceRemarks.push(question.remarks)
                    clonedQuestion.instanceFileName.push(question.fileName)
                    delete clonedQuestion.value
                    delete clonedQuestion.remarks
                    delete clonedQuestion.fileName
                    delete clonedQuestion.payload
                    answerArray[question.qid] = clonedQuestion
                  }

                })
              }
              answer[1].countOfInstances = answer[1].value.length
            }
            answerArray[answer[0]] = answer[1]
          });

          evidencesStatusToBeChanged['isSubmitted'] = true;
          evidencesStatusToBeChanged['notApplicable'] = false;
          evidencesStatusToBeChanged['startTime'] = "";
          evidencesStatusToBeChanged['endTime'] = new Date;
          evidencesStatusToBeChanged['hasConflicts'] = false;
          evidencesStatusToBeChanged['submissions'].push(_.omit(evidenceSubmission, "answers"));

          updateObject.$push = {
            ["evidences." + parentInterviewEvidenceMethod + ".submissions"]: evidenceSubmission
          }
          updateObject.$set = {
            answers: _.assignIn(submissionDocument.answers, answerArray),
            ["evidences." + parentInterviewEvidenceMethod + ".isSubmitted"]: true,
            ["evidences." + parentInterviewEvidenceMethod + ".notApplicable"]: false,
            ["evidences." + parentInterviewEvidenceMethod + ".startTime"]: "",
            ["evidences." + parentInterviewEvidenceMethod + ".endTime"]: new Date,
            ["evidences." + parentInterviewEvidenceMethod + ".hasConflicts"]: false,
            evidencesStatus: submissionDocument.evidencesStatus,
            status: (submissionDocument.status === "started") ? "inprogress" : submissionDocument.status
          }


        } else {


          updateSchoolObject.$set = {
            isParentInterviewCompleted: true
          }

          schoolUpdatedDocument = await database.models.schools.findOneAndUpdate(
            schoolQueryObject,
            updateSchoolObject,
            {}
          );



          //isParentInterviewCompleted

          let response = {
            message: "Already completed."
          };

          return resolve(response);
        }

        if (runUpdateQuery) {
          let updatedSubmissionDocument = await database.models.submissions.findOneAndUpdate(
            queryObject,
            updateObject,
            queryOptions
          );

          let canRatingsBeEnabled = await this.canEnableRatingQuestionsOfSubmission(updatedSubmissionDocument)
          let { ratingsEnabled } = canRatingsBeEnabled

          if (ratingsEnabled) {
            updateObject.$set = {
              status: "completed",
              completedDate: new Date()
            }
            updatedSubmissionDocument = await database.models.submissions.findOneAndUpdate(
              queryObject,
              updateObject,
              queryOptions
            );
          }

          updateSchoolObject.$set = {
            isParentInterviewCompleted: true
          }

          schoolUpdatedDocument = await database.models.schools.findOneAndUpdate(
            schoolQueryObject,
            updateSchoolObject,
            {}
          );


          let response = {
            message: message
          };

          return resolve(response);

        } else {

          let response = {
            message: "Failed to complete parent interview."
          };

          return resolve(response);
        }

      } catch (error) {
        return reject({
          status: 500,
          message: "Oops! Something went wrong!",
          errorObject: error
        });
      }

    })
  }

  async generalQuestions(req) {
    return new Promise(async (resolve, reject) => {

      try {

        req.body = req.body || {};
        let message = "General question submitted successfully."
        let runUpdateQuery = false

        let queryObject = {
          _id: ObjectId(req.params._id)
        }

        let queryOptions = {
          new: true
        }

        let submissionDocument = await database.models.submissions.findOne(
          queryObject
        );

        let updateObject = {}
        updateObject.$set = {}

        if (req.body.answers) {
          let gpsLocation = req.headers.gpslocation
          let submittedBy = req.userDetails.userId
          let submissionDate = new Date()

          Object.entries(req.body.answers).forEach(answer => {
            if (answer[1].isAGeneralQuestion == true && answer[1].responseType === "matrix" && answer[1].evidenceMethod != "") {
              runUpdateQuery = true
              answer[1].gpslocation = gpsLocation
              answer[1].submittedBy = submittedBy
              answer[1].submissionDate = submissionDate
              if (submissionDocument.generalQuestions && submissionDocument.generalQuestions[answer[0]]) {
                submissionDocument.generalQuestions[answer[0]].submissions.push(answer[1])
              } else {
                submissionDocument.generalQuestions = {
                  [answer[0]]: {
                    submissions: [answer[1]]
                  }
                }
              }
              if (submissionDocument.evidences[answer[1].evidenceMethod].isSubmitted === true) {
                submissionDocument.evidences[answer[1].evidenceMethod].submissions.forEach((evidenceMethodSubmission, indexOfEvidenceMethodSubmission) => {
                  if (evidenceMethodSubmission.answers[answer[0]] && evidenceMethodSubmission.answers[answer[0]].notApplicable != true) {
                    answer[1].value.forEach(incomingGeneralQuestionInstance => {
                      incomingGeneralQuestionInstance.isAGeneralQuestionResponse = true
                      evidenceMethodSubmission.answers[answer[0]].value.push(incomingGeneralQuestionInstance)
                    })
                    answer[1].payload.labels[0].forEach(incomingGeneralQuestionInstancePayload => {
                      evidenceMethodSubmission.answers[answer[0]].payload.labels[0].push(incomingGeneralQuestionInstancePayload)
                    })
                    evidenceMethodSubmission.answers[answer[0]].countOfInstances = evidenceMethodSubmission.answers[answer[0]].value.length
                  }
                  if (evidenceMethodSubmission.isValid === true) {

                    for (let countOfInstances = 0; countOfInstances < answer[1].value.length; countOfInstances++) {

                      _.valuesIn(answer[1].value[countOfInstances]).forEach(question => {

                        if (submissionDocument.answers[question.qid]) {
                          submissionDocument.answers[question.qid].instanceResponses.push(question.value)
                          submissionDocument.answers[question.qid].instanceRemarks.push(question.remarks)
                          submissionDocument.answers[question.qid].instanceFileName.push(question.fileName)
                        } else {
                          let clonedQuestion = { ...question }
                          clonedQuestion.instanceResponses = new Array
                          clonedQuestion.instanceRemarks = new Array
                          clonedQuestion.instanceFileName = new Array
                          clonedQuestion.instanceResponses.push(question.value)
                          clonedQuestion.instanceRemarks.push(question.remarks)
                          clonedQuestion.instanceFileName.push(question.fileName)
                          delete clonedQuestion.value
                          delete clonedQuestion.remarks
                          delete clonedQuestion.fileName
                          delete clonedQuestion.payload
                          submissionDocument.answers[question.qid] = clonedQuestion
                        }

                      })
                    }
                  }

                })
              }

            }
          });

          updateObject.$set.generalQuestions = submissionDocument.generalQuestions
          updateObject.$set.evidences = submissionDocument.evidences
          updateObject.$set.answers = submissionDocument.answers

        }

        if (runUpdateQuery) {
          let updatedSubmissionDocument = await database.models.submissions.findOneAndUpdate(
            queryObject,
            updateObject,
            queryOptions
          );

          let response = {
            message: message
          };

          return resolve(response);

        } else {

          let response = {
            message: "Failed to submit general questions"
          };

          return resolve(response);
        }

      } catch (error) {
        return reject({
          status: 500,
          message: "Oops! Something went wrong!",
          errorObject: error
        });
      }

    })
  }

  async parentInterview(req) {
    return new Promise(async (resolve, reject) => {

      try {

        req.body = req.body || {};
        let message = "Parent interview submitted successfully."

        let queryObject = {
          _id: ObjectId(req.params._id)
        }

        let queryOptions = {
          new: true
        }

        let submissionDocument = await database.models.submissions.findOne(
          queryObject
        );

        if (req.body.parentId && req.body.status && submissionDocument) {

          let parentInformation = await database.models.parentRegistry.findOne(
            { _id: ObjectId(req.body.parentId) }
          );

          if (parentInformation) {
            let parentInterview = {}
            parentInterview.parentInformation = parentInformation
            parentInterview.status = req.body.status
            parentInterview.answers = req.body.answers
            if (submissionDocument.parentInterviewResponses) {
              submissionDocument.parentInterviewResponses[req.body.parentId] = parentInterview
            } else {
              submissionDocument.parentInterviewResponses = {}
              submissionDocument.parentInterviewResponses[req.body.parentId] = parentInterview
            }
            let updateObject = {}
            updateObject.$set = {}
            updateObject.$set.parentInterviewResponses = {}
            updateObject.$set.parentInterviewResponses = submissionDocument.parentInterviewResponses

            let updatedSubmissionDocument = await database.models.submissions.findOneAndUpdate(
              { _id: ObjectId(submissionDocument._id) },
              updateObject,
              queryOptions
            );

          } else {
            throw "No parent information found."
          }

        } else {
          throw "No submission document found."
        }


        let response = {
          message: message
        };

        return resolve(response);

      } catch (error) {
        return reject({
          status: 500,
          message: "Oops! Something went wrong!",
          errorObject: error
        });
      }

    })
  }

  /**
* @api {get} /assessment/api/v1/submissions/getParentInterviewResponse/:submissionId Fetch Parent interview
* @apiVersion 0.0.1
* @apiName Fetch Parent Interview
* @apiGroup submissions
* @apiParam {String} parentId Parent ID.
* @apiUse successBody
* @apiUse errorBody
*/

  async getParentInterviewResponse(req) {
    return new Promise(async (resolve, reject) => {

      try {

        req.body = req.body || {};
        let message = "Parent interview response fetched successfully."
        let result = {}

        let queryObject = {
          _id: ObjectId(req.params._id)
        }

        let queryOptions = {
          new: true
        }

        let submissionDocument = await database.models.submissions.findOne(
          queryObject
        );

        if (req.query.parentId && submissionDocument) {

          let parentInformation = await database.models.parentRegistry.findOne(
            { _id: ObjectId(req.query.parentId) }
          );

          if (parentInformation) {
            result.parentInformation = parentInformation
            result.parentId = req.query.parentId
          }

          if ((submissionDocument.parentInterviewResponses) && submissionDocument.parentInterviewResponses[req.query.parentId]) {
            result.status = submissionDocument.parentInterviewResponses[req.query.parentId].status
            result.answers = submissionDocument.parentInterviewResponses[req.query.parentId].answers
          }
          else {
            let noSubmissionResponse = {
              result: [],
              message: "No submissions for parent found"
            };

            return resolve(noSubmissionResponse);

          }

        } else {

          let noSubmissionResponse = {
            result: [],
            message: "No submissions found"
          };

          return resolve(noSubmissionResponse);
        }


        let response = {
          result: result,
          message: message
        };

        return resolve(response);

      } catch (error) {
        return reject({
          status: 500,
          message: "Oops! Something went wrong!",
          errorObject: error
        });
      }

    })
  }

  async rate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        req.body = req.body || {};
        let message = "Crtieria rating completed successfully"

        let queryObject = {
          "schoolInformation.externalId": req.params._id
        }

        let submissionDocument = await database.models.submissions.findOne(
          queryObject,
          { answers: 1, criterias: 1 }
        );

        if (!submissionDocument._id) {
          throw "Couldn't find the submission document"
        }

        let result = {}
        result.runUpdateQuery = true

        let criteriaData = await Promise.all(submissionDocument.criterias.map(async (criteria) => {

          result[criteria.externalId] = {}
          result[criteria.externalId].criteriaName = criteria.name
          result[criteria.externalId].criteriaExternalId = criteria.externalId

          // criteria.externalId == "SS/I/c3" && 
          if (criteria.rubric.expressionVariables && criteria.rubric.levels.L1.expression != "" && criteria.rubric.levels.L2.expression != "" && criteria.rubric.levels.L3.expression != "" && criteria.rubric.levels.L4.expression != "") {
            let submissionAnswers = new Array
            const questionValueExtractor = function (question) {
              const questionArray = question.split('.')
              submissionAnswers.push(submissionDocument.answers[questionArray[0]])
              // if(question == "5be6d08c9a14ba4b5038dd7e.value" || question == "5be6d0c59a14ba4b5038dd7f.value") {
              //   console.log(question)
              //   console.log(questionArray[0])
              //   console.log(questionArray[1])
              //   console.log(submissionDocument.answers[questionArray[0]])
              //   console.log(submissionDocument.answers[questionArray[0]].value)
              // }
              if (questionArray[1] === "value") {
                if (submissionDocument.answers[questionArray[0]] && submissionDocument.answers[questionArray[0]].value) {
                  return submissionDocument.answers[questionArray[0]].value
                } else {
                  return "NA"
                }
              } else if (questionArray[1] === "mode") {
                if (submissionDocument.answers[questionArray[0]] && submissionDocument.answers[questionArray[0]].value) {
                  return submissionDocument.answers[questionArray[0]].value
                } else {
                  return "NA"
                }
              } else if (questionArray[1] === "instanceResponses") {
                if (submissionDocument.answers[questionArray[0]] && submissionDocument.answers[questionArray[0]].instanceResponses) {
                  return submissionDocument.answers[questionArray[0]].instanceResponses
                } else {
                  return "NA"
                }
              } else if (questionArray[1] === "endTime") {
                if (submissionDocument.answers[questionArray[0]] && submissionDocument.answers[questionArray[0]].endTime) {
                  return submissionDocument.answers[questionArray[0]].endTime
                } else {
                  return "NA"
                }
              } else if (questionArray[1] === "startTime") {
                if (submissionDocument.answers[questionArray[0]] && submissionDocument.answers[questionArray[0]].startTime) {
                  return submissionDocument.answers[questionArray[0]].startTime
                } else {
                  return "NA"
                }
              } else if (questionArray[1] === "countOfInstances") {
                if (submissionDocument.answers[questionArray[0]] && submissionDocument.answers[questionArray[0]].countOfInstances) {
                  return submissionDocument.answers[questionArray[0]].countOfInstances
                } else {
                  return "NA"
                }
              }
            }
            let expressionVariables = {}
            let expressionResult = {}
            let allValuesAvailable = true
            Object.keys(criteria.rubric.expressionVariables).forEach(variable => {
              if (variable != "default") {
                expressionVariables[variable] = questionValueExtractor(criteria.rubric.expressionVariables[variable])
                expressionVariables[variable] = (expressionVariables[variable] === "NA" && criteria.rubric.expressionVariables.default && criteria.rubric.expressionVariables.default[variable]) ? criteria.rubric.expressionVariables.default[variable] : expressionVariables[variable]
                if (expressionVariables[variable] === "NA") {
                  allValuesAvailable = false
                }
              }
            })

            if (allValuesAvailable) {
              Object.keys(criteria.rubric.levels).forEach(level => {

                // if(level == "L3") {
                //   console.log("Debugging new functions starts")
                //   console.log(expressionVariables)
                //   console.log(math.eval("(compareTextValues(PR1, 'R1') == 0)",expressionVariables))
                //   console.log(math.eval("(checkIfPresent('R2||R3',PR2) >= 0)",expressionVariables))
                //   console.log(math.eval("(compareTextValues(PR3, 'R1') == 0)",expressionVariables))
                //   console.log(math.eval("(compareTextValues(PR4, 'R3||R4') == 0)",expressionVariables))
                //   console.log("Debugging new functions ends")
                // }

                if (criteria.rubric.levels[level].expression != "") {
                  try {
                    expressionResult[level] = {
                      expressionParsed: criteria.rubric.levels[level].expression,
                      result: mathJs.eval(criteria.rubric.levels[level].expression, expressionVariables)
                    }
                  } catch (error) {
                    console.log("---------------Some exception caught begins---------------")
                    console.log(error)
                    console.log(criteria.name)
                    console.log(criteria.rubric.levels[level].expression)
                    console.log(expressionVariables)
                    console.log(criteria.rubric.expressionVariables)
                    console.log("---------------Some exception caught ends---------------")
                  }
                } else {
                  expressionResult[level] = {
                    expressionParsed: criteria.rubric.levels[level].expression,
                    result: false
                  }
                }
              })
            }

            let score = "NA"
            if (allValuesAvailable) {
              if (expressionResult.L4.result) {
                score = "L4"
              } else if (expressionResult.L3.result) {
                score = "L3"
              } else if (expressionResult.L2.result) {
                score = "L2"
              } else if (expressionResult.L1.result) {
                score = "L1"
              } else {
                score = "No Level Matched"
              }
            }

            // const parser = math.parser()
            // create a string
            // console.log(math.compareText("hello", "hello"))                      // String, "hello"

            result[criteria.externalId].expressionVariablesDefined = criteria.rubric.expressionVariables
            result[criteria.externalId].expressionVariables = expressionVariables

            if (score == "NA") {
              result[criteria.externalId].valuesNotFound = true
              result[criteria.externalId].score = score
              criteria.score = score
            } else if (score == "No Level Matched") {
              result[criteria.externalId].noExpressionMatched = true
              result[criteria.externalId].score = score
              criteria.score = score
            } else {
              result[criteria.externalId].score = score
              criteria.score = score
            }

            result[criteria.externalId].expressionResult = expressionResult
            result[criteria.externalId].submissionAnswers = submissionAnswers

          }

          return criteria

        }));

        if (criteriaData.findIndex(criteria => criteria === undefined) >= 0) {
          result.runUpdateQuery = false
        }

        if (result.runUpdateQuery) {
          let updateObject = {}

          updateObject.$set = {
            criterias: criteriaData
          }

          let updatedSubmissionDocument = await database.models.submissions.findOneAndUpdate(
            queryObject,
            updateObject
          );
        }

        let response = {
          message: message,
          result: result
        };

        return resolve(response);

      } catch (error) {
        return reject({
          status: 500,
          message: error,
          errorObject: error
        });
      }

    })
  }

  /**
* @api {get} /assessment/api/v1/submissions/isAllowed/:submissionId Fetch submissions
* @apiVersion 0.0.1
* @apiName Fetch submissions
* @apiGroup submissions
* @apiParam {String} evidenceId Evidence ID.
* @apiUse successBody
* @apiUse errorBody
*/
  async isAllowed(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = {
          allowed: true
        }
        req.body = req.body || {};
        let message = "Submission check completed successfully"

        let queryObject = {
          "_id": req.params._id
        }

        let submissionDocument = await database.models.submissions.findOne(
          queryObject,
          {
            ["evidences." + req.query.evidenceId + ".isSubmitted"]: 1,
            ["evidences." + req.query.evidenceId + ".submissions"]: 1
          }
        );

        if (!submissionDocument || !submissionDocument._id) {
          throw "Couldn't find the submission document"
        } else {
          if (submissionDocument.evidences[req.query.evidenceId].isSubmitted && submissionDocument.evidences[req.query.evidenceId].isSubmitted == true) {
            submissionDocument.evidences[req.query.evidenceId].submissions.forEach(submission => {
              if (submission.submittedBy == req.userDetails.userId) {
                result.allowed = false
              }
            })
          }
        }

        let response = {
          message: message,
          result: result
        };

        return resolve(response);

      } catch (error) {
        return reject({
          status: 500,
          message: error,
          errorObject: error
        });
      }

    })
  }

  // Commented out the rating flow
  // async fetchRatingQuestions(req) {
  //   return new Promise(async (resolve, reject) => {
  //     req.body = req.body || {};

  //     let result = {}
  //     let responseMessage

  //     let queryObject = {
  //       _id: ObjectId(req.params._id)
  //     }

  //     let submissionDocument = await database.models.submissions.findOne(
  //       queryObject
  //     );

  //     if(submissionDocument.ratingOfManualCriteriaEnabled === true) {

  //       result._id = submissionDocument._id
  //       result.status = submissionDocument.status

  //       let {isEditable, criterias} = await this.extractCriteriaQuestionsOfSubmission(submissionDocument, req.userDetails.allRoles)
  //       result.isEditable = isEditable
  //       result.criterias = criterias
  //       result.allManualCriteriaRatingSubmitted = (submissionDocument.allManualCriteriaRatingSubmitted) ? submissionDocument.allManualCriteriaRatingSubmitted : false
  //       responseMessage = "Rating questions fetched successfully."

  //     } else {
  //       responseMessage = "Rating questions not yet enabled for this submission."
  //     }

  //     let response = { message: responseMessage, result: result };
  //     return resolve(response);

  //   }).catch(error => {
  //     reject(error);
  //   });
  // }

  // Commented out the rating flow
  // async submitRatingQuestions(req) {
  //   return new Promise(async (resolve, reject) => {
  //     req.body = req.body || {};
  //     let responseMessage = "Rating questions submission completed successfully"
  //     let runUpdateQuery = false

  //     let queryObject = {
  //       _id: ObjectId(req.params._id)
  //     }

  //     let submissionDocument = await database.models.submissions.findOne(
  //       queryObject
  //     );

  //     let updateObject = {}
  //     let result = {}

  //     if(req.body.ratings) {
  //       if(submissionDocument.ratingOfManualCriteriaEnabled === true && submissionDocument.allManualCriteriaRatingSubmitted != true) {
  //         runUpdateQuery = true
  //         Object.entries(req.body.ratings).forEach(rating => {
  //           let criteriaElm = _.find(submissionDocument.criterias, {_id:ObjectId(rating[1].criteriaId)});
  //           criteriaElm.score = rating[1].score
  //           criteriaElm.remarks = rating[1].remarks
  //           criteriaElm.ratingSubmittedBy = req.userDetails.userId
  //           criteriaElm.ratingSubmissionDate = new Date()
  //           criteriaElm.ratingSubmissionGpsLocation = req.headers.gpslocation
  //         });
  //         updateObject.$set = { 
  //           criterias : submissionDocument.criterias,
  //           allManualCriteriaRatingSubmitted: true
  //         }
  //       } else {
  //         responseMessage = "Cannot submit ratings for this submission."
  //       }
  //     } else {
  //       responseMessage = "Invalid request"
  //     }

  //     if(runUpdateQuery) {

  //       result = await database.models.submissions.findOneAndUpdate(
  //         queryObject,
  //         updateObject
  //       );

  //       let response = {
  //         message: responseMessage
  //       };

  //       return resolve(response);

  //     } else {

  //       let response = {
  //         message: responseMessage
  //       };

  //       return resolve(response);
  //     }


  //   }).catch(error => {
  //     reject(error);
  //   });
  // }


  // Commented out the rating flow
  // async fetchCriteriaRatings(req) {
  //   return new Promise(async (resolve, reject) => {
  //     req.body = req.body || {};
  //     let result = {}
  //     let responseMessage = ""

  //     let queryObject = {
  //       _id: ObjectId(req.params._id)
  //     }

  //     let submissionDocument = await database.models.submissions.findOne(
  //       queryObject
  //     );

  //     if(submissionDocument.allManualCriteriaRatingSubmitted === true) {
  //       let criteriaResponses = {}
  //       submissionDocument.criterias.forEach(criteria => {
  //         if (criteria.criteriaType === 'manual') {
  //           criteriaResponses[criteria._id] = _.pick(criteria, ['_id', 'name', 'externalId', 'description', 'score', 'remarks', 'flag'])

  //           if(criteria.flagRaised && criteria.flagRaised[req.userDetails.userId]) {
  //             criteriaResponses[criteria._id].flagRaised = _.pick(criteria.flagRaised[req.userDetails.userId], ['value', 'remarks', 'submissionDate'])
  //           }

  //         }
  //       })

  //       result._id = submissionDocument._id
  //       result.status = submissionDocument.status
  //       result.isEditable = (_.includes(req.userDetails.allRoles,"ASSESSOR")) ? true : false
  //       result.criterias = _.values(criteriaResponses)
  //       responseMessage = "Criteria ratings fetched successfully."
  //     } else {
  //       responseMessage = "No Criteria ratings found for this assessment."
  //     }

  //     let response = {
  //       message: responseMessage,
  //       result: result
  //     };
  //     return resolve(response);
  //   }).catch(error => {
  //     reject(error);
  //   });
  // }


  // Commented out the rating flow
  // async flagCriteriaRatings(req) {
  //   return new Promise(async (resolve, reject) => {
  //     req.body = req.body || {};
  //     let responseMessage
  //     let runUpdateQuery = false

  //     let queryObject = {
  //       _id: ObjectId(req.params._id)
  //     }

  //     let submissionDocument = await database.models.submissions.findOne(
  //       queryObject
  //     );

  //     let updateObject = {}
  //     let result = {}

  //     if(req.body.flag) {
  //       if(submissionDocument.allManualCriteriaRatingSubmitted === true) {
  //         Object.entries(req.body.flag).forEach(flag => {
  //           let criteriaElm = _.find(submissionDocument.criterias, {_id:ObjectId(flag[1].criteriaId)});

  //           flag[1].userId = req.userDetails.userId
  //           flag[1].submissionDate = new Date()
  //           flag[1].submissionGpsLocation = req.headers.gpslocation

  //           if(criteriaElm.flagRaised && criteriaElm.flagRaised[req.userDetails.userId]) {
  //             responseMessage = "You cannot update an already flagged criteria."
  //           } else if(criteriaElm.flagRaised) {
  //             runUpdateQuery = true
  //             criteriaElm.flagRaised[req.userDetails.userId] = flag[1]
  //           } else {
  //             runUpdateQuery = true
  //             criteriaElm.flagRaised = {}
  //             criteriaElm.flagRaised[req.userDetails.userId] = flag[1]
  //           }

  //         });
  //         updateObject.$set = { criterias : submissionDocument.criterias }
  //       } else {
  //         responseMessage = "Cannot flag ratings for this assessment."
  //       }
  //     } else {
  //       responseMessage = "Invalid request"
  //     }

  //     if(runUpdateQuery) {
  //       result = await database.models.submissions.findOneAndUpdate(
  //         queryObject,
  //         updateObject
  //       );

  //       responseMessage = "Criterias flagged successfully."

  //     }

  //     let response = {
  //       message: responseMessage
  //     };

  //     return resolve(response);

  //   }).catch(error => {
  //     reject(error);
  //   });
  // }

  /**
   * @api {post} {{url}}/assessment/api/v1/submissions/feedback/:submissionId Submission feedback added
   * @apiVersion 0.0.1
   * @apiName Submission Feedback 
   * @apiGroup submissions
   * @apiParamExample {json} Request-Body:
   * {
	 * "feedback": {
	 *       "q1" : "",
	 *       "q2" : "",
	 *       "q3" : ""     
	 * }
   *  }
   * @apiUse successBody
   * @apiUse errorBody
   */
  async feedback(req) {
    return new Promise(async (resolve, reject) => {
      req.body = req.body || {};
      let responseMessage
      let runUpdateQuery = false

      let queryObject = {
        _id: ObjectId(req.params._id)
      }

      let submissionDocument = await database.models.submissions.findOne(
        queryObject
      );

      let updateObject = {}

      if (req.body.feedback && submissionDocument.status != "started") {

        req.body.feedback.userId = req.userDetails.userId
        req.body.feedback.submissionDate = new Date()
        req.body.feedback.submissionGpsLocation = req.headers.gpslocation

        runUpdateQuery = true

        updateObject.$push = {
          ["feedback"]: req.body.feedback
        }

      } else {
        responseMessage = "Atleast one evidence method has to be completed before giving feedback."
      }

      if (runUpdateQuery) {
        let result = await database.models.submissions.findOneAndUpdate(
          queryObject,
          updateObject
        );

        responseMessage = "Feedback submitted successfully."

      }

      let response = {
        message: responseMessage
      };

      return resolve(response);

    }).catch(error => {
      reject(error);
    });
  }

  /**
* @api {get} /assessment/api/v1/submissions/status/ Fetch submission status
* @apiVersion 0.0.1
* @apiName Fetch submission status
* @apiGroup submissions
* @apiSampleRequest /assessment/api/v1/submissions/status/5c5147ae95743c5718445eff
* @apiParam {String} submissionId Submission ID.
* @apiUse successBody
* @apiUse errorBody
*/

  async status(req) {
    return new Promise(async (resolve, reject) => {
      req.body = req.body || {};
      let result = {}

      let queryObject = {
        _id: ObjectId(req.params._id)
      }

      let submissionDocument = await database.models.submissions.findOne(
        queryObject
      );

      if (submissionDocument) {
        result._id = submissionDocument._id
        result.status = submissionDocument.status
        result.evidences = submissionDocument.evidences
      }

      let response = { message: "Submission status fetched successfully", result: result };

      return resolve(response);
    }).catch(error => {
      reject(error);
    });
  }


  extractStatusOfSubmission(submissionDocument) {

    let result = {}
    result._id = submissionDocument._id
    result.status = submissionDocument.status
    result.evidences = submissionDocument.evidences

    return result;

  }

  // Commented out the rating flow
  // extractCriteriaQuestionsOfSubmission(submissionDocument, requestingUserRoles) {

  //   let result = {}
  //   let criteriaResponses = {}
  //   submissionDocument.criterias.forEach(criteria => {
  //     if (criteria.criteriaType === 'manual') {
  //       criteriaResponses[criteria._id] = _.pick(criteria, ['_id', 'name', 'externalId', 'description', 'score', 'rubric', 'remarks'])
  //       criteriaResponses[criteria._id].questions = []
  //     }
  //   })

  //   if(submissionDocument.answers) {
  //     Object.entries(submissionDocument.answers).forEach(answer => {
  //       if(criteriaResponses[answer[1].criteriaId] != undefined) {
  //         criteriaResponses[answer[1].criteriaId].questions.push(answer[1])
  //       }
  //     });
  //   }

  //   result.isEditable = (_.includes(requestingUserRoles,"ASSESSOR")) ? false : true
  //   result.criterias = _.values(criteriaResponses)

  //   return result;

  // }

  canEnableRatingQuestionsOfSubmission(submissionDocument) {

    let result = {}
    result.ratingsEnabled = true
    result.responseMessage = ""

    if (submissionDocument.evidences && submissionDocument.status !== "blocked") {
      const evidencesArray = Object.entries(submissionDocument.evidences)
      for (let iterator = 0; iterator < evidencesArray.length; iterator++) {
        if (!evidencesArray[iterator][1].isSubmitted || evidencesArray[iterator][1].hasConflicts === true) {
          result.ratingsEnabled = false
          result.responseMessage = "Sorry! All evidence methods have to be completed to enable ratings."
          break
        }
      }
    } else {
      result.ratingsEnabled = false
      result.responseMessage = "Sorry! This could be because the assessment has been blocked. Resolve conflicts to proceed further."
    }

    return result;

  }

};