const express = require("express");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const cors = require("cors"); // Import the cors middleware

const app = express();
const port = 3001;
const openaiApiKey = "";
const openai = new OpenAI({ apiKey: openaiApiKey });
app.use(cors());

// question to audio , it will be question sent to the backend it will
app.get("/generate-audio", async (req, res) => {
  try {
    const question = req.query.question;
    if (!userInput) {
      return res.status(400).send("Missing 'text' parameter");
    }
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: question,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const filePath = path.resolve("./speech.mp3");
    await fs.promises.writeFile(filePath, buffer);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).send("Internal Server Error");
  }
});


// generate topic wise questions 
app.post('/topic-questions', async (req, res) => {
  try {
    const topic = req.body.topic;
    const level = req.body.level;

    if (!topic || !level) {
      return res.status(400).json({ error: 'Missing topic/level in the request body' });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate 5 situational question for taking interview on the topic ${topic} with difficulty level ${level}.`,
        },
      ],
      model: "gpt-3.5-turbo",
    })
    const generatedQuestions = completion.choices[0];
    res.json({ generatedQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// questiions based on Job description
app.post('/jd-questions', async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Missing jobDescription in the request body' });
    }
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
    res.json({ generatedQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// generate suggestions
app.post('/jd-questions', async (req, res) => {
  try {
    const question = req.body.question;
    const answer = req.body.answer;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Missing jobDescription in the request body' });
    }
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
    res.json({ generatedQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// generate coding questions
app.get('/coding-questions', async (req, res) => {
  try {
    const topic = req.body.topic;
    const level = req.body.level;

    if (!topic || !level) {
      return res.status(400).json({ error: 'Missing jobDescription in the request body' });
    }
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
    res.json({ generatedQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// verify code
app.get('/evaluate-code', async (req, res) => {
  try {
    const question = req.body.userQuestion;
    const code = req.body.userCode;

    if (!topic || !level) {
      return res.status(400).json({ error: 'Missing jobDescription in the request body' });
    }
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
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
