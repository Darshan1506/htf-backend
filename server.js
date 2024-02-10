const express = require("express");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
const port = 3001;
const openaiApiKey = "";
const openai = new OpenAI({ apiKey: openaiApiKey });
app.use(cors());
app.use(express.json());
// question to audio , it will be question sent to the backend it will
app.post("/generate-audio", async (req, res) => {
    const question = req.body.question;
    // if (!userInput) {
    //   return res.status(400).send("Missing 'text' parameter");
    // }
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: question,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const filePath = path.resolve("./speech.mp3");
    await fs.promises.writeFile(filePath, buffer);
    res.sendFile(filePath);
});


// generate topic wise questions 
app.post('/topic-questions', async (req, res) => {
  const topic = req.body.topic;
  const level = req.body.level;

    console.log(req.body); 

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate 5 situational questions for taking an interview on the ${topic} with difficulty level ${level}.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const generatedQuestions = completion.choices[0].message.content
      .split('\n')
      .filter(question => question.trim() !== "");
    console.log(generatedQuestions);
    res.json({ generatedQuestions });
});


// questiions based on Job description
app.post('/jd-questions', async (req, res) => {
    const jobDescription = req.body.jobDescription;
    const conversation = [
      {
        role: "system",
        content:
          "You are a helpful assistant that assists with technical interview questions.",
      },
      {
        role: "user",
        content:jobDescription,
      },
      {
        role: "assistant",
        content:
          "Great! Based on your experience i.e. consider yourself as experienced interviewer, here are 5 technical questions for your interview:",
      },
    ];

    const completion = await openai.chat.completions.create({
      messages: conversation,
      model: "gpt-3.5-turbo",
    });
    const generatedQuestions = completion.choices[0];
    console.log(generatedQuestions)
    res.json({ generatedQuestions });
});


// generate suggestions
app.post('/suggestions', async (req, res) => {
    const question = req.body.question;
    const answer = req.body.answer;

    const conversation = [
      {
        role: "system",
        content:
          "You are a interviewer",
      },
      {
        role: "user",
        content: `This is the ${question} asked by you as a interviewer and the interviewee answered ${answer} .Can you provide feedback on the user\'s information? Highlight areas that may need improvement or clarification. and on next line provide a rating out of 10`,
      },
    ];

    const completion = await openai.chat.completions.create({
      messages: conversation,
      model: "gpt-3.5-turbo",
    });
    const generatedQuestions = completion.choices[0];
    console.log(generatedQuestions)
    res.json({ generatedQuestions });
});

// generate coding questions
app.post('/coding-questions', async (req, res) => {
    const topic = req.body.topic;
    const level = req.body.level;
    const conversation = [
      {
        role: "system",
        content:
          "You are a interviewer",
      },
      {
        role: "user",
        content: `You are a interview platform. you have to generrate a coding problem. Generate a problem statement for a ${topic} role of difficulty ${level}. Generate only one Data structure and algorithm problem`,
      },
    ];

    const completion = await openai.chat.completions.create({
      messages: conversation,
      model: "gpt-3.5-turbo",
    });
    const generatedQuestions = completion.choices[0];
    console.log(generatedQuestions)
    res.json({ generatedQuestions });
});


// verify code
app.post('/evaluate-code', async (req, res) => {
    const question = req.body.userQuestion;
    const code = req.body.userCode;

    const conversation = [
      {
        role: "system",
        content:
          "You are a interviewer",
      },
      {
        role: "user",
        content: `You are a interview platform. you have given a problem statement i.e ${question}, and the user has submitted the code or solution i.e ${code}. Evalute the solution provided by user with respect to the problem statement and provide feedback and if the solution is wrong then also provide correct code.`,
      },
    ];
    const completion = await openai.chat.completions.create({
      messages: conversation,
      model: "gpt-3.5-turbo",
    });
    const generatedQuestions = completion.choices[0];
    res.json({ generatedQuestions });
});

// generate coding questions
app.post('/coding-questions', async (req, res) => {
  const topic = req.body.topic;
  const level = req.body.level;
  const conversation = [
    {
      role: "system",
      content:
        "You are a interviewer",
    },
    {
      role: "user",
      content: `You are a interview platform. you have to generrate a coding problem. Generate a problem statement for a ${topic} role of difficulty ${level}. Generate only one Data structure and algorithm problem`,
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-3.5-turbo",
  });
  const generatedQuestions = completion.choices[0];
  console.log(generatedQuestions)
  res.json({ generatedQuestions });
});

app.get('/work-culture', async (req, res) => {
  const conversation = [
    {
      role: "system",
      content:
        "You are a interviewer",
    },
    {
      role: "user",
      content: `You are a interview platform. Prepare a set of 10 questions to prepare a interviwee for HR round like work culture , opinions, pay questions and more`,
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-3.5-turbo",
  });
  const generatedQuestions = completion.choices[0];
  console.log(generatedQuestions)
  res.json({ generatedQuestions });
});

app.get('/work-culture', async (req, res) => {
  const conversation = [
    {
      role: "system",
      content:
        "You are a interviewer",
    },
    {
      role: "user",
      content: `You are a interview platform. Prepare a set of 10 questions to prepare a interviwee for HR round like work culture , opinions, pay questions and more`,
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-3.5-turbo",
  });
  const generatedQuestions = completion.choices[0];
  console.log(generatedQuestions)
  res.json({ generatedQuestions });
});

app.post('/evalute-workculture', async (req, res) => {
  const question = req.body.question;
  const answer = req.body.answer;

  const conversation = [
    {
      role: "system",
      content:
        "You are a interviewer",
    },
    {
      role: "user",
      content: `This is the ${question} asked by you as a interviewer in the hr round and the interviewee answered ${answer} .Can you provide feedback on the user\'s information? Highlight areas that may need improvement or clarification or mention what's the point they should keep in mind for hr round questions and on next line provide a rating out of 10`,
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-3.5-turbo",
  });
  const generatedQuestions = completion.choices[0];
  console.log(generatedQuestions)
  res.json({ generatedQuestions });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});