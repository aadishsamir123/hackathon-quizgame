import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DebugPage = () => {
  const [lessons, setLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    questions: [
      {
        question: '',
        answers: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
      const lessonsData = lessonsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setMessage('Error fetching lessons: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLesson = async (lesson, isNew = false) => {
    try {
      setLoading(true);
      
      if (isNew) {
        await addDoc(collection(db, 'lessons'), lesson);
        setMessage('Lesson added successfully!');
      } else {
        await setDoc(doc(db, 'lessons', lesson.id), lesson);
        setMessage('Lesson updated successfully!');
      }
      
      await fetchLessons();
      setEditingLesson(null);
      if (isNew) {
        setNewLesson({
          title: '',
          description: '',
          category: '',
          difficulty: 'Beginner',
          questions: [
            {
              question: '',
              answers: ['', '', '', ''],
              correctAnswer: 0
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      setMessage('Error saving lesson: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'lessons', lessonId));
      setMessage('Lesson deleted successfully!');
      await fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setMessage('Error deleting lesson: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSampleLessons = async () => {
    const sampleLessons = [
      // 10 complete quizzes, each with ~10 questions
      {
        title: "Kindness Matters",
        description: "Explore ways to show kindness in everyday life.",
        category: "Character Education",
        difficulty: "Beginner",
        questions: [
          { question: "What is a simple way to show kindness at school?", answers: ["Smile at someone", "Ignore others", "Take things without asking", "Be rude"], correctAnswer: 0 },
          { question: "How can you help a classmate who dropped their books?", answers: ["Laugh at them", "Help pick up the books", "Walk away", "Tell others to help"], correctAnswer: 1 },
          { question: "Which is a kind thing to say?", answers: ["You did a great job!", "You're not good enough", "Nobody likes you", "You always mess up"], correctAnswer: 0 },
          { question: "How can you be kind to yourself?", answers: ["Practice positive self-talk", "Be very critical", "Never try new things", "Compare yourself negatively"], correctAnswer: 0 },
          { question: "What should you do if you see someone sitting alone?", answers: ["Invite them to join you", "Ignore them", "Make fun of them", "Tell others to avoid them"], correctAnswer: 0 },
          { question: "Kindness can help you...", answers: ["Make friends", "Feel happier", "Create a positive environment", "All of the above"], correctAnswer: 3 },
          { question: "Which is NOT an act of kindness?", answers: ["Helping someone", "Bullying", "Sharing", "Listening"], correctAnswer: 1 },
          { question: "How can you show kindness online?", answers: ["Send positive messages", "Post mean comments", "Ignore others", "Share rumors"], correctAnswer: 0 },
          { question: "Why is kindness important?", answers: ["It makes the world better", "It helps people feel valued", "It builds trust", "All of the above"], correctAnswer: 3 },
          { question: "What is a random act of kindness?", answers: ["Doing something nice unexpectedly", "Being mean", "Ignoring others", "Taking things"], correctAnswer: 0 }
        ]
      },
      {
        title: "Empathy in Action",
        description: "Learn how to understand and share others' feelings.",
        category: "Social-Emotional Learning",
        difficulty: "Beginner",
        questions: [
          { question: "What does empathy mean?", answers: ["Feeling sorry for someone", "Understanding and sharing feelings", "Giving advice", "Telling someone how to feel"], correctAnswer: 1 },
          { question: "How can you show empathy to a friend who's sad?", answers: ["Listen and offer support", "Ignore them", "Tell them to cheer up", "Make jokes"], correctAnswer: 0 },
          { question: "Empathy helps you...", answers: ["Build stronger relationships", "Understand others", "Be a better friend", "All of the above"], correctAnswer: 3 },
          { question: "Which is NOT showing empathy?", answers: ["Judging someone", "Listening", "Respecting feelings", "Trying to understand"], correctAnswer: 0 },
          { question: "How can you practice empathy?", answers: ["Put yourself in others' shoes", "Ignore feelings", "Be selfish", "Talk over others"], correctAnswer: 0 },
          { question: "Empathy is important because...", answers: ["It helps people feel understood", "It reduces conflict", "It builds trust", "All of the above"], correctAnswer: 3 },
          { question: "If someone is nervous, you should...", answers: ["Acknowledge their feelings", "Tell them to stop", "Laugh at them", "Ignore them"], correctAnswer: 0 },
          { question: "Empathy can help prevent...", answers: ["Bullying", "Loneliness", "Misunderstandings", "All of the above"], correctAnswer: 3 },
          { question: "How can you show empathy online?", answers: ["Send supportive messages", "Post mean comments", "Ignore others", "Share rumors"], correctAnswer: 0 },
          { question: "Empathy is a skill that can be...", answers: ["Learned and practiced", "Ignored", "Unimportant", "Only for adults"], correctAnswer: 0 }
        ]
      },
      {
        title: "Bullying Prevention",
        description: "Learn how to recognize, prevent, and respond to bullying.",
        category: "Social-Emotional Learning",
        difficulty: "Intermediate",
        questions: [
          { question: "What is bullying?", answers: ["A one-time argument", "Repeated aggressive behavior meant to hurt someone", "Any conflict between peers", "Friendly teasing"], correctAnswer: 1 },
          { question: "Which is an example of cyberbullying?", answers: ["Sending a friendly text", "Posting embarrassing photos of someone without permission", "Playing online games together", "Tagging friends in memes"], correctAnswer: 1 },
          { question: "What should you do if you witness bullying?", answers: ["Join in so you don't become a target", "Ignore it completely", "Tell a trusted adult", "Film it on your phone"], correctAnswer: 2 },
          { question: "What's the difference between reporting and tattling?", answers: ["They're the same thing", "Reporting helps someone in danger; tattling is to get someone in trouble", "Tattling is always right", "Reporting is always wrong"], correctAnswer: 1 },
          { question: "How can you stand up to a bully safely?", answers: ["Fight them physically", "Use a confident voice to tell them to stop", "Bully them back", "Spread rumors about them"], correctAnswer: 1 },
          { question: "What might be a reason someone bullies others?", answers: ["They may have been bullied themselves", "They might want to feel powerful", "They may not understand how hurtful it is", "All of the above"], correctAnswer: 3 },
          { question: "Which is NOT a good strategy to stop bullying?", answers: ["Talking to a trusted adult", "Staying in groups", "Fighting back physically", "Walking away from the situation"], correctAnswer: 2 },
          { question: "Bystanders who witness bullying should:", answers: ["Pretend they don't see it", "Laugh along with the bully", "Support the person being bullied", "Record it to share later"], correctAnswer: 2 },
          { question: "What might someone who is being bullied feel?", answers: ["Sad and lonely", "Scared to go to school", "Like it's their fault", "All of the above"], correctAnswer: 3 },
          { question: "How can schools help prevent bullying?", answers: ["By having clear rules against bullying", "By teaching students about respect", "By providing ways to report bullying safely", "All of the above"], correctAnswer: 3 }
        ]
      },
      {
        title: "Conflict Resolution",
        description: "Learn healthy ways to resolve disagreements with others.",
        category: "Social Skills",
        difficulty: "Intermediate",
        questions: [
          { question: "What is conflict resolution?", answers: ["Avoiding all disagreements", "Finding peaceful ways to resolve disagreements", "Winning arguments", "Making the other person apologize"], correctAnswer: 1 },
          { question: "Which is a good first step when you have a conflict with someone?", answers: ["Yell at them", "Talk to them calmly", "Tell everyone else about it", "Ignore them forever"], correctAnswer: 1 },
          { question: "When resolving a conflict, it's important to:", answers: ["Make the other person feel bad", "Listen to the other person's perspective", "Get everyone to take your side", "Bring up past mistakes"], correctAnswer: 1 },
          { question: "What does it mean to compromise?", answers: ["Getting everything you want", "Giving up completely", "Each person gives up something to reach an agreement", "Making the other person apologize"], correctAnswer: 2 },
          { question: "Which is NOT a healthy way to handle anger during a conflict?", answers: ["Taking deep breaths", "Counting to ten", "Hitting something", "Walking away to calm down"], correctAnswer: 2 },
          { question: "Using 'I' statements means:", answers: ["Making everything about yourself", "Expressing your feelings without blaming the other person", "Avoiding responsibility", "Pointing out what the other person did wrong"], correctAnswer: 1 },
          { question: "Which is an example of an 'I' statement?", answers: ["You always make me so angry!", "I feel frustrated when plans change at the last minute.", "You never listen to me!", "I can't believe you did that!"], correctAnswer: 1 },
          { question: "What is mediation?", answers: ["Fighting until someone wins", "Having a neutral person help resolve a conflict", "Avoiding the person you're in conflict with", "Getting everyone to take your side"], correctAnswer: 1 },
          { question: "What is a win-win solution?", answers: ["When you get everything you want", "When no one gets what they want", "When both people feel the solution is fair", "When you convince others you're right"], correctAnswer: 2 },
          { question: "Conflicts can be positive because:", answers: ["They help you understand different perspectives", "They can lead to better solutions", "They help build relationship skills", "All of the above"], correctAnswer: 3 }
        ]
      },
      {
        title: "Growth Mindset",
        description: "Develop a positive approach to challenges and learning.",
        category: "Personal Development",
        difficulty: "Beginner",
        questions: [
          { question: "What is a growth mindset?", answers: ["Believing your abilities are fixed and can't change", "Believing you can develop abilities through hard work", "Thinking you're already good at everything", "Avoiding challenges"], correctAnswer: 1 },
          { question: "Someone with a growth mindset would say:", answers: ["I'm just not good at math", "I can get better at math with practice", "I'll never understand this", "I was born this way"], correctAnswer: 1 },
          { question: "When you face a difficult challenge, a growth mindset helps you:", answers: ["Give up quickly", "Blame others when you fail", "See it as an opportunity to learn", "Avoid challenges in the future"], correctAnswer: 2 },
          { question: "What does 'yet' mean in a growth mindset?", answers: ["You'll never be able to do something", "You can't do something right now, but could in the future", "You should stop trying", "You should only do what you're already good at"], correctAnswer: 1 },
          { question: "When you make a mistake with a growth mindset, you:", answers: ["Feel embarrassed and give up", "Learn from it and try again", "Blame someone else", "Only do things you can't fail at"], correctAnswer: 1 },
          { question: "Which is an example of a fixed mindset?", answers: ["I'll try a different strategy next time", "I'm just not a math person", "This is hard, but I'll keep practicing", "Mistakes help me learn"], correctAnswer: 1 },
          { question: "What can help build a growth mindset?", answers: ["Only doing what you're already good at", "Avoiding all challenges", "Celebrating effort and process, not just results", "Giving up when things get difficult"], correctAnswer: 2 },
          { question: "How does a growth mindset help you learn?", answers: ["It doesn't help with learning", "It makes you avoid difficult subjects", "It helps you persist through challenges", "It makes learning happen instantly"], correctAnswer: 2 },
          { question: "What does 'the power of yet' mean?", answers: ["You'll never succeed", "You haven't succeeded so far, but you can in the future", "You should give up", "You were born with certain abilities that can't change"], correctAnswer: 1 },
          { question: "People with a growth mindset view criticism as:", answers: ["A personal attack", "Something to ignore", "Helpful feedback for improvement", "Proof they should give up"], correctAnswer: 2 }
        ]
      },
      {
        title: "Digital Citizenship",
        description: "Learn to use technology responsibly and safely.",
        category: "Technology Education",
        difficulty: "Intermediate",
        questions: [
          { question: "What is digital citizenship?", answers: ["Using technology all the time", "Using technology in responsible and respectful ways", "Being famous online", "Creating viral content"], correctAnswer: 1 },
          { question: "What personal information should you NOT share online?", answers: ["Your favorite color", "Your home address", "Your opinion about a movie", "Your hobby"], correctAnswer: 1 },
          { question: "What is a digital footprint?", answers: ["A picture of your foot", "All the information about you online", "A computer virus", "A type of password"], correctAnswer: 1 },
          { question: "Which password is most secure?", answers: ["password123", "your name", "K7$p2Vr9!", "12345678"], correctAnswer: 2 },
          { question: "What should you do if someone is being mean to you online?", answers: ["Be mean back to them", "Keep it a secret", "Tell a trusted adult", "Share their personal information"], correctAnswer: 2 },
          { question: "What does it mean to be a good digital citizen?", answers: ["Spending all day online", "Respecting others online", "Having the most followers", "Sharing everything about your life"], correctAnswer: 1 },
          { question: "What is plagiarism?", answers: ["Creating original content", "Using someone else's work without permission or credit", "Sharing funny memes", "Posting pictures of yourself"], correctAnswer: 1 },
          { question: "How can you tell if information online is trustworthy?", answers: ["If it has a lot of likes", "If the website looks professional", "By checking multiple reliable sources", "If it was shared by a friend"], correctAnswer: 2 },
          { question: "What is cyberbullying?", answers: ["Playing online games", "Using technology to harm or harass others", "Making friends online", "Sharing photos"], correctAnswer: 1 },
          { question: "What's a healthy amount of time to spend using screens?", answers: ["As much as possible", "None at all", "A balanced amount with breaks and other activities", "Only when at school"], correctAnswer: 2 }
        ]
      },
      {
        title: "Gratitude Practice",
        description: "Learn the benefits of thankfulness and appreciation.",
        category: "Mindfulness",
        difficulty: "Beginner",
        questions: [
          { question: "What is gratitude?", answers: ["Feeling entitled to things", "Being thankful and appreciative", "Being unhappy with what you have", "Wanting more things"], correctAnswer: 1 },
          { question: "How can practicing gratitude affect your mood?", answers: ["It has no effect", "It can make you feel more positive", "It makes you feel worse", "It makes you more tired"], correctAnswer: 1 },
          { question: "Which is a way to practice gratitude?", answers: ["Complaining about what you don't have", "Keeping a gratitude journal", "Ignoring kind gestures", "Being envious of others"], correctAnswer: 1 },
          { question: "When you express gratitude to someone, it can:", answers: ["Make them feel unappreciated", "Strengthen your relationship", "Make them feel uncomfortable", "Have no effect on them"], correctAnswer: 1 },
          { question: "Gratitude helps you focus on:", answers: ["What's missing in your life", "What's wrong with others", "The positive things in your life", "Why life is unfair"], correctAnswer: 2 },
          { question: "What's a gratitude journal?", answers: ["A place to write complaints", "A record of things you're thankful for", "A book about famous people", "A diary of secrets"], correctAnswer: 1 },
          { question: "How often should you practice gratitude for it to be effective?", answers: ["Only on holidays", "Once a year", "Regularly, like daily or weekly", "Never"], correctAnswer: 2 },
          { question: "Which is NOT a benefit of practicing gratitude?", answers: ["Improved well-being", "Better relationships", "Increased materialism", "More positive outlook"], correctAnswer: 2 },
          { question: "What can you be grateful for?", answers: ["Only big, important things", "Only material possessions", "Both big and small things in your life", "Only what others don't have"], correctAnswer: 2 },
          { question: "How can you show gratitude to others?", answers: ["By saying thank you", "By writing a note of appreciation", "By doing something kind in return", "All of the above"], correctAnswer: 3 }
        ]
      },
      {
        title: "Respect & Diversity",
        description: "Learn to value and celebrate differences in others.",
        category: "Cultural Awareness",
        difficulty: "Intermediate",
        questions: [
          { question: "What does respect mean?", answers: ["Treating others with consideration and dignity", "Agreeing with everyone", "Only valuing people like yourself", "Being polite to authority figures only"], correctAnswer: 0 },
          { question: "What is diversity?", answers: ["Everyone being the same", "Including only certain groups", "The variety of human differences in a community", "Separating people based on differences"], correctAnswer: 2 },
          { question: "How does diversity make a community stronger?", answers: ["It doesn't affect communities", "It brings different perspectives and ideas", "It makes everything more complicated", "It forces everyone to change"], correctAnswer: 1 },
          { question: "Which is an example of respecting diversity?", answers: ["Making fun of different traditions", "Learning about different cultures", "Avoiding people who are different", "Treating everyone exactly the same"], correctAnswer: 1 },
          { question: "What does it mean to have bias?", answers: ["To be fair to everyone", "To have preferences for or against certain groups", "To celebrate differences", "To treat everyone equally"], correctAnswer: 1 },
          { question: "How can you learn about other cultures respectfully?", answers: ["By assuming stereotypes are true", "By asking invasive personal questions", "By listening and asking respectful questions", "By telling others their traditions are strange"], correctAnswer: 2 },
          { question: "When someone shares their cultural traditions with you, you should:", answers: ["Tell them your culture is better", "Make fun of differences", "Show interest and appreciation", "Ignore what they're sharing"], correctAnswer: 2 },
          { question: "What is inclusion?", answers: ["Separating people based on differences", "Creating environments where everyone feels welcome", "Treating everyone exactly the same", "Focusing only on majority groups"], correctAnswer: 1 },
          { question: "What should you do if you hear someone making disrespectful comments about a group?", answers: ["Join in to fit in", "Ignore it completely", "Speak up respectfully or get help", "Laugh along even if uncomfortable"], correctAnswer: 2 },
          { question: "Why is it important to respect different viewpoints?", answers: ["It's not important", "It helps us learn and grow", "Only if they agree with you", "Only if an authority figure says so"], correctAnswer: 1 }
        ]
      },
      {
        title: "Self-Regulation",
        description: "Learn to manage your emotions and behaviors effectively.",
        category: "Social-Emotional Learning",
        difficulty: "Intermediate",
        questions: [
          { question: "What is self-regulation?", answers: ["Always being happy", "The ability to manage your emotions and behaviors", "Ignoring your feelings", "Doing whatever you want"], correctAnswer: 1 },
          { question: "When you feel angry, a helpful self-regulation strategy is:", answers: ["Yelling at someone", "Taking deep breaths", "Breaking something", "Ignoring the feeling"], correctAnswer: 1 },
          { question: "What is a trigger?", answers: ["Something that helps you calm down", "Something that causes a strong emotional reaction", "A type of breathing exercise", "A way to ignore feelings"], correctAnswer: 1 },
          { question: "Why is identifying your emotions important?", answers: ["It isn't important", "So you can hide them better", "To manage them effectively", "To make others responsible for them"], correctAnswer: 2 },
          { question: "What is impulse control?", answers: ["Acting without thinking", "The ability to think before acting", "Letting out all your emotions at once", "Always suppressing your feelings"], correctAnswer: 1 },
          { question: "When you're overwhelmed, it helps to:", answers: ["Make important decisions immediately", "Take a break and calm down", "Blame others for how you feel", "Act on your first impulse"], correctAnswer: 1 },
          { question: "A calming technique for self-regulation is:", answers: ["Counting to 10", "Listening to loud music", "Eating sugary foods", "Watching exciting videos"], correctAnswer: 0 },
          { question: "Self-regulation helps you:", answers: ["Avoid all emotions", "Make better decisions", "Always get your way", "Blame others for problems"], correctAnswer: 1 },
          { question: "What does it mean to have a 'cool down' strategy?", answers: ["Ignoring problems", "Having a plan to calm yourself when upset", "Being cold to others", "Never getting emotional"], correctAnswer: 1 },
          { question: "Which is an example of good self-regulation?", answers: ["Throwing a tantrum when upset", "Recognizing you're frustrated and taking a break", "Yelling at someone who makes you angry", "Giving up when things get difficult"], correctAnswer: 1 }
        ]
      },
      {
        title: "Effective Communication",
        description: "Learn skills for clear and respectful communication.",
        category: "Social Skills",
        difficulty: "Intermediate",
        questions: [
          { question: "What makes communication effective?", answers: ["Speaking loudly", "Being clear and respectful", "Using complicated words", "Interrupting others"], correctAnswer: 1 },
          { question: "What is active listening?", answers: ["Waiting for your turn to speak", "Thinking about your response while others talk", "Fully focusing on the speaker", "Interrupting with questions"], correctAnswer: 2 },
          { question: "Body language is:", answers: ["Not important in communication", "How we communicate without words", "Only relevant in formal settings", "The same in all cultures"], correctAnswer: 1 },
          { question: "Which is an example of active listening?", answers: ["Checking your phone while someone talks", "Nodding and asking clarifying questions", "Thinking about what to say next", "Interrupting with your own story"], correctAnswer: 1 },
          { question: "What are 'I' statements?", answers: ["Ways to blame others", "Expressions that focus on your feelings and needs", "Commands that others must follow", "Statements that point out others' flaws"], correctAnswer: 1 },
          { question: "Clear communication includes:", answers: ["Using vague language", "Being specific about your thoughts and needs", "Assuming others know what you mean", "Hiding your true feelings"], correctAnswer: 1 },
          { question: "What can interfere with effective communication?", answers: ["Active listening", "Clear speech", "Emotional barriers", "Asking questions"], correctAnswer: 2 },
          { question: "When someone is speaking, you should:", answers: ["Interrupt with your thoughts", "Look at your phone", "Give them your full attention", "Start talking to someone else"], correctAnswer: 2 },
          { question: "What is tone of voice?", answers: ["How loud you speak", "The attitude conveyed by how you speak", "Speaking in monotone", "Always speaking softly"], correctAnswer: 1 },
          { question: "What makes feedback constructive?", answers: ["Being brutally honest", "Focusing only on mistakes", "Being specific and respectful", "Avoiding all criticism"], correctAnswer: 2 }
        ]
      },
      {
        title: "Problem Solving",
        description: "Develop skills for addressing challenges and finding solutions.",
        category: "Critical Thinking",
        difficulty: "Intermediate",
        questions: [
          { question: "What is the first step in problem solving?", answers: ["Finding someone to blame", "Identifying the problem clearly", "Implementing the first solution you think of", "Giving up"], correctAnswer: 1 },
          { question: "What is brainstorming?", answers: ["Thinking about just one solution", "Coming up with many possible ideas without judging them", "Doing what someone else suggests", "Avoiding difficult problems"], correctAnswer: 1 },
          { question: "After trying a solution, what should you do next?", answers: ["Give up if it didn't work perfectly", "Blame others if it fails", "Evaluate how well it worked", "Never try again"], correctAnswer: 2 },
          { question: "Which approach helps with complex problems?", answers: ["Rushing to the first solution", "Breaking the problem into smaller parts", "Ignoring difficult aspects", "Always doing what worked before"], correctAnswer: 1 },
          { question: "What does it mean to think critically about a problem?", answers: ["Being negative", "Being analytical and thoughtful", "Criticizing others' ideas", "Avoiding the problem"], correctAnswer: 1 },
          { question: "Why is it helpful to look at a problem from different perspectives?", answers: ["It's not helpful", "To see solutions you might otherwise miss", "To prove others wrong", "To make the problem more complicated"], correctAnswer: 1 },
          { question: "What should you do when you're stuck on a problem?", answers: ["Give up immediately", "Take a break and come back to it", "Blame the problem", "Always ask someone else to solve it"], correctAnswer: 1 },
          { question: "Which question helps with problem solving?", answers: ["Who can I blame?", "Why is this happening to me?", "What have I tried and what could I try next?", "How can I avoid this problem?"], correctAnswer: 2 },
          { question: "What is an advantage of working with others to solve problems?", answers: ["Having more people to blame", "More diverse perspectives and ideas", "Being able to let others do all the work", "Making the problem more complicated"], correctAnswer: 1 },
          { question: "What is a growth mindset approach to problems?", answers: ["Seeing them as opportunities to learn", "Avoiding all problems", "Blaming yourself when things go wrong", "Giving up when solutions aren't obvious"], correctAnswer: 0 }
        ]
      },
      {
        title: "Goal Setting",
        description: "Learn to set and achieve meaningful personal goals.",
        category: "Personal Development",
        difficulty: "Intermediate",
        questions: [
          { question: "What makes a goal SMART?", answers: ["Being vague and general", "Being Specific, Measurable, Achievable, Relevant, and Time-bound", "Being really difficult to achieve", "Being easy to accomplish"], correctAnswer: 1 },
          { question: "Why is it important to write down your goals?", answers: ["It's not important", "It makes them more concrete and you're more likely to remember them", "So others can judge your progress", "To make them permanent and unchangeable"], correctAnswer: 1 },
          { question: "What's a good approach to big, long-term goals?", answers: ["Give up if you don't achieve them quickly", "Break them down into smaller steps", "Keep them vague so you can change them", "Never tell anyone about them"], correctAnswer: 1 },
          { question: "How often should you review your goals?", answers: ["Never", "Only when you achieve them", "Regularly to track progress and make adjustments", "Only when you fail"], correctAnswer: 2 },
          { question: "What can help you stay motivated to achieve goals?", answers: ["Setting only easy goals", "Tracking your progress", "Never changing your goals", "Avoiding challenges"], correctAnswer: 1 },
          { question: "Which type of goal is more effective?", answers: ["'I want to lose weight'", "'I will walk 30 minutes every day this week'", "'I should try to exercise more'", "'I might try to eat better'"], correctAnswer: 1 },
          { question: "What should you do if you don't achieve a goal on time?", answers: ["Give up completely", "Blame others", "Reflect, adjust, and keep going", "Set only easy goals in the future"], correctAnswer: 2 },
          { question: "How can sharing goals with others help?", answers: ["It doesn't help", "It can provide accountability and support", "It ensures you never change your goals", "It guarantees success"], correctAnswer: 1 },
          { question: "What's the purpose of setting goals?", answers: ["To make yourself feel bad", "To impress others", "To have direction and measure progress", "To compete with others"], correctAnswer: 2 },
          { question: "Which is an example of a process goal?", answers: ["Winning a championship", "Reading for 20 minutes every day", "Being the best student", "Getting an A+ on every test"], correctAnswer: 1 }
        ]
      },
      {
        title: "Healthy Habits",
        description: "Learn the basics of physical and mental well-being.",
        category: "Health Education",
        difficulty: "Beginner",
        questions: [
          { question: "How much sleep do most children need each night?", answers: ["4-5 hours", "6-7 hours", "9-12 hours", "As little as possible"], correctAnswer: 2 },
          { question: "Which is a healthy eating habit?", answers: ["Skipping breakfast", "Eating a variety of fruits and vegetables", "Drinking lots of sugary drinks", "Eating only one type of food"], correctAnswer: 1 },
          { question: "How much physical activity should children get daily?", answers: ["None", "About 10 minutes", "At least 60 minutes", "Only on weekends"], correctAnswer: 2 },
          { question: "What's a good way to manage stress?", answers: ["Ignoring your feelings", "Deep breathing or meditation", "Watching TV all day", "Eating lots of junk food"], correctAnswer: 1 },
          { question: "Why is drinking water important?", answers: ["It's not important", "It helps your body function properly", "Only if you're playing sports", "Only in summer"], correctAnswer: 1 },
          { question: "Which is a healthy way to use screens?", answers: ["All day without breaks", "Having set time limits", "Right before bedtime", "Instead of physical activity"], correctAnswer: 1 },
          { question: "What's important for good hand hygiene?", answers: ["Washing hands quickly with just water", "Washing with soap and water for at least 20 seconds", "Never washing hands", "Only washing after using the restroom"], correctAnswer: 1 },
          { question: "What can help you have a healthy mind?", answers: ["Never talking about feelings", "Regular exercise and good sleep", "Avoiding all challenges", "Spending all day on social media"], correctAnswer: 1 },
          { question: "Why is it important to limit sugary foods and drinks?", answers: ["They provide important nutrients", "They can lead to health problems like cavities and weight gain", "They're always bad for you", "It's not important"], correctAnswer: 1 },
          { question: "What is a balanced meal?", answers: ["Only eating your favorite foods", "Eating just one type of food", "Including different food groups like proteins, grains, and vegetables", "Eating as much as possible"], correctAnswer: 2 }
        ]
      },
      {
        title: "Responsible Decision Making",
        description: "Learn to make thoughtful choices with positive outcomes.",
        category: "Social-Emotional Learning",
        difficulty: "Intermediate",
        questions: [
          { question: "What is responsible decision making?", answers: ["Doing whatever is easiest", "Making choices that have positive consequences for yourself and others", "Always doing what friends want", "Avoiding all decisions"], correctAnswer: 1 },
          { question: "Before making an important decision, you should:", answers: ["Act immediately without thinking", "Consider possible consequences", "Do whatever is most fun", "Let someone else decide"], correctAnswer: 1 },
          { question: "What role do values play in decision making?", answers: ["They're not important", "They help guide your choices", "They should be ignored", "Only adults have values"], correctAnswer: 1 },
          { question: "Which strategy helps with decision making?", answers: ["Making decisions when you're very emotional", "Weighing pros and cons", "Always choosing the first option", "Never asking for advice"], correctAnswer: 1 },
          { question: "When faced with peer pressure to do something unsafe, you should:", answers: ["Always go along with the group", "Consider the safety and consequences first", "Do it if your best friend is doing it", "Never think about consequences"], correctAnswer: 1 },
          { question: "What does it mean to take responsibility for your decisions?", answers: ["Blaming others when things go wrong", "Acknowledging your role in the outcome", "Only taking credit for good results", "Avoiding making decisions"], correctAnswer: 1 },
          { question: "How can emotions affect decision making?", answers: ["They have no effect", "Strong emotions can sometimes cloud judgment", "You should always ignore all feelings", "Decisions should only be based on emotions"], correctAnswer: 1 },
          { question: "When is it good to ask for help with a decision?", answers: ["Never", "When the decision is complex or has serious consequences", "Only if you're younger than 10", "Only for unimportant decisions"], correctAnswer: 1 },
          { question: "Which is an example of a responsible decision?", answers: ["Copying someone's homework to save time", "Standing up for someone being bullied", "Keeping quiet when you see something wrong", "Breaking rules when no one is watching"], correctAnswer: 1 },
          { question: "After making a decision that didn't work out, what should you do?", answers: ["Blame others", "Reflect on what you learned for next time", "Never make decisions again", "Hide the results"], correctAnswer: 1 }
        ]
      },
      {
        title: "Teamwork Skills",
        description: "Learn to collaborate effectively with others.",
        category: "Social Skills",
        difficulty: "Beginner",
        questions: [
          { question: "What makes a good team member?", answers: ["Always getting your own way", "Taking credit for the team's work", "Contributing and supporting others", "Working alone"], correctAnswer: 2 },
          { question: "Why is listening important in teamwork?", answers: ["It's not important", "To understand others' ideas and perspectives", "Only the team leader needs to listen", "Only to find flaws in others' ideas"], correctAnswer: 1 },
          { question: "What should you do if you disagree with a teammate's idea?", answers: ["Ignore them completely", "Express your thoughts respectfully", "Make fun of their idea", "Quit the team"], correctAnswer: 1 },
          { question: "Which is an example of good teamwork?", answers: ["One person does all the work", "Everyone contributes their strengths", "Team members compete against each other", "Working in silence"], correctAnswer: 1 },
          { question: "How should tasks be divided in a team?", answers: ["The most popular person gets the easiest tasks", "Based on each person's strengths and skills", "The youngest person does all the work", "Randomly without discussion"], correctAnswer: 1 },
          { question: "What does 'pulling your weight' mean in a team?", answers: ["Lifting heavy objects", "Doing your fair share of the work", "Being the strongest person", "Taking control of everything"], correctAnswer: 1 },
          { question: "When there's a conflict in a team, you should:", answers: ["Ignore it and hope it goes away", "Work together to find a solution", "Take sides immediately", "Leave the team"], correctAnswer: 1 },
          { question: "What's the value of different perspectives in a team?", answers: ["They slow the team down", "They can lead to better, more creative solutions", "There is no value", "Only the leader's perspective matters"], correctAnswer: 1 },
          { question: "How can you help a teammate who is struggling?", answers: ["Ignore them", "Offer support or assistance", "Tell them to leave the team", "Take over their work without asking"], correctAnswer: 1 },
          { question: "What makes team communication effective?", answers: ["Everyone talking at once", "Only one person speaking the whole time", "Clear, respectful exchange of ideas", "Keeping important information secret"], correctAnswer: 2 }
        ]
      },
      {
        title: "Emotional Awareness",
        description: "Learn to recognize and understand your feelings.",
        category: "Social-Emotional Learning",
        difficulty: "Beginner",
        questions: [
          { question: "What are emotions?", answers: ["Things you should always hide", "Feelings that provide information about our experiences", "Only for small children", "Signs of weakness"], correctAnswer: 1 },
          { question: "Why is it important to identify your emotions?", answers: ["It's not important", "To manage them in healthy ways", "To always keep them hidden", "To make them go away"], correctAnswer: 1 },
          { question: "How do emotions affect your body?", answers: ["They have no physical effect", "They can cause physical reactions like faster heartbeat or tense muscles", "Only bad emotions affect your body", "Only adults have physical reactions to emotions"], correctAnswer: 1 },
          { question: "What can help you identify what you're feeling?", answers: ["Ignoring all feelings", "Paying attention to physical sensations and thoughts", "Always feeling the same way", "Never talking about feelings"], correctAnswer: 1 },
          { question: "Which statement is true about emotions?", answers: ["All emotions are bad", "All emotions are good", "All emotions are helpful signals, even uncomfortable ones", "You should only feel happy emotions"], correctAnswer: 2 },
          { question: "When you feel angry, your body might:", answers: ["Feel completely relaxed", "Have a racing heart or tense muscles", "Have no physical reaction", "Fall asleep immediately"], correctAnswer: 1 },
          { question: "Emotional awareness means:", answers: ["Never showing emotions", "Being able to recognize and name your feelings", "Only feeling happy emotions", "Ignoring all feelings"], correctAnswer: 1 },
          { question: "Different emotions might feel like:", answers: ["All emotions feel exactly the same", "Happiness might feel light, anger might feel hot", "Emotions have no physical sensations", "Only adults can feel emotions"], correctAnswer: 1 },
          { question: "How can naming your emotions help you?", answers: ["It doesn't help at all", "It can help you manage them better", "It makes emotions more intense", "It makes emotions disappear"], correctAnswer: 1 },
          { question: "Which is NOT a basic emotion?", answers: ["Happiness", "Sadness", "Fear", "Contemplation"], correctAnswer: 3 }
        ]
      },
      {
        title: "Mindfulness",
        description: "Learn to focus on the present moment with awareness.",
        category: "Mental Wellness",
        difficulty: "Beginner",
        questions: [
          { question: "What is mindfulness?", answers: ["Never thinking about anything", "Worrying about the future", "Paying attention to the present moment without judgment", "Always being happy"], correctAnswer: 2 },
          { question: "How can mindfulness help you?", answers: ["It can reduce stress and improve focus", "It solves all problems instantly", "It helps you avoid all emotions", "It has no benefits"], correctAnswer: 0 },
          { question: "Which is a mindfulness practice?", answers: ["Planning tomorrow's activities", "Focused breathing", "Worrying about past mistakes", "Multitasking"], correctAnswer: 1 },
          { question: "When practicing mindfulness, you should:", answers: ["Judge all your thoughts as good or bad", "Try to stop all thoughts", "Notice thoughts and feelings without judgment", "Only think positive thoughts"], correctAnswer: 2 },
          { question: "Mindful breathing means:", answers: ["Breathing as fast as possible", "Paying attention to your breath", "Holding your breath for a long time", "Breathing only through your mouth"], correctAnswer: 1 },
          { question: "Which activity can be done mindfully?", answers: ["Only meditation", "Eating, walking, or listening", "Only while sitting perfectly still", "Only in complete silence"], correctAnswer: 1 },
          { question: "What happens when your mind wanders during mindfulness practice?", answers: ["You've failed completely", "Gently bring your attention back without criticism", "Give up immediately", "You're not doing it right"], correctAnswer: 1 },
          { question: "How long should mindfulness practice be?", answers: ["At least 1 hour each time", "Even a few minutes can be beneficial", "As long as possible until you're exhausted", "Only during special occasions"], correctAnswer: 1 },
          { question: "Mindfulness helps you:", answers: ["Escape from reality", "Become a perfect person", "Be more aware of your thoughts and feelings", "Avoid all problems"], correctAnswer: 2 },
          { question: "What's the goal of mindfulness?", answers: ["To have no thoughts", "To be perfect", "To develop awareness and acceptance", "To always be happy"], correctAnswer: 2 }
        ]
      },
      {
        title: "Stress Management",
        description: "Learn healthy ways to cope with stress and pressure.",
        category: "Mental Wellness",
        difficulty: "Intermediate",
        questions: [
          { question: "What is stress?", answers: ["A type of food", "Your body's response to demands or challenges", "A made-up feeling", "Something only adults experience"], correctAnswer: 1 },
          { question: "Which is a physical sign of stress?", answers: ["Always feeling happy", "Headaches or stomach aches", "Having lots of energy", "Sleeping perfectly"], correctAnswer: 1 },
          { question: "Which is a healthy way to manage stress?", answers: ["Ignoring it completely", "Physical activity or deep breathing", "Playing video games all day", "Yelling at others"], correctAnswer: 1 },
          { question: "How does talking about stress with someone you trust help?", answers: ["It doesn't help at all", "It can provide relief and new perspectives", "It makes stress worse", "Only professional help works"], correctAnswer: 1 },
          { question: "What role does sleep play in stress management?", answers: ["It's not related to stress", "Good sleep helps your body recover from stress", "Less sleep is better for stress", "Only naps help with stress"], correctAnswer: 1 },
          { question: "Which activity can reduce stress?", answers: ["Watching scary movies", "Mindful breathing or meditation", "Drinking caffeine", "Staying up all night"], correctAnswer: 1 },
          { question: "What happens to your body during stress?", answers: ["Nothing physical happens", "Your heart rate might increase and muscles tense", "Your body temperature drops significantly", "Your hair changes color"], correctAnswer: 1 },
          { question: "Which statement about stress is true?", answers: ["All stress is harmful", "Some stress can be helpful and motivating", "Only adults experience stress", "Stress is not a real feeling"], correctAnswer: 1 },
          { question: "How can planning and organization help with stress?", answers: ["They make stress worse", "They can reduce feeling overwhelmed", "They have no effect on stress", "Only relaxation techniques help with stress"], correctAnswer: 1 },
          { question: "When should you ask for help with stress?", answers: ["Never, you should handle it alone", "When it feels overwhelming or affects daily life", "Only for extremely serious problems", "Only as a last resort"], correctAnswer: 1 }
        ]
      },
      {
        title: "Friendship Skills",
        description: "Learn how to build and maintain positive friendships.",
        category: "Social Skills",
        difficulty: "Beginner",
        questions: [
          { question: "What makes someone a good friend?", answers: ["They give you presents", "They are kind, trustworthy, and supportive", "They're always available", "They never disagree with you"], correctAnswer: 1 },
          { question: "How can you show someone you want to be friends?", answers: ["Ignore them until they approach you", "Show interest in their life and activities", "Tell everyone else you like them", "Give them your homework to copy"], correctAnswer: 1 },
          { question: "What should you do if a friend is sad?", answers: ["Ignore them until they feel better", "Listen and offer support", "Tell them to cheer up immediately", "Tell everyone about their problems"], correctAnswer: 1 },
          { question: "True friends:", answers: ["Always let you have your way", "Support you while also helping you grow", "Never disagree with you", "Like everything you like"], correctAnswer: 1 },
          { question: "If you have a disagreement with a friend, you should:", answers: ["Never speak to them again", "Talk about it calmly and listen to their perspective", "Tell everyone they're wrong", "Pretend it didn't happen"], correctAnswer: 1 },
          { question: "What does it mean to be loyal to your friends?", answers: ["Always doing what they want", "Standing by them and keeping their confidences", "Only having one friend", "Copying everything they do"], correctAnswer: 1 },
          { question: "How can you make new friends?", answers: ["Wait for others to approach you", "Join activities you enjoy and be open to conversation", "Change your personality to match others", "Only talk to people exactly like you"], correctAnswer: 1 },
          { question: "Healthy friendships involve:", answers: ["One person making all the decisions", "Taking turns and compromising", "Always getting your way", "Being friends with everyone"], correctAnswer: 1 },
          { question: "What should you do if a friend wants you to do something wrong?", answers: ["Do it to keep the friendship", "Refuse politely and suggest something else", "Ignore them forever after", "Tell everyone what they wanted you to do"], correctAnswer: 1 },
          { question: "What makes friendships last?", answers: ["Giving expensive gifts", "Trust, communication, and mutual respect", "Never having any disagreements", "Being exactly the same in every way"], correctAnswer: 1 }
        ]
      },
      {
        title: "Leadership Skills",
        description: "Learn the qualities and skills of effective leaders.",
        category: "Personal Development",
        difficulty: "Intermediate",
        questions: [
          { question: "What is leadership?", answers: ["Telling others what to do", "Guiding and inspiring others toward a goal", "Being the boss", "Making all the decisions"], correctAnswer: 1 },
          { question: "A good leader:", answers: ["Never listens to others' ideas", "Takes credit for everyone's work", "Leads by example", "Makes all decisions alone"], correctAnswer: 2 },
          { question: "Why is communication important for leaders?", answers: ["To give orders", "To share vision and listen to feedback", "Only to announce decisions", "It's not important for leaders"], correctAnswer: 1 },
          { question: "What does it mean to delegate?", answers: ["Doing everything yourself", "Assigning tasks to team members based on their strengths", "Avoiding responsibility", "Taking credit for others' work"], correctAnswer: 1 },
          { question: "How do leaders handle mistakes?", answers: ["Blame team members", "Pretend they didn't happen", "Take responsibility and learn from them", "Quit being a leader"], correctAnswer: 2 },
          { question: "What is leading by example?", answers: ["Telling others what to do", "Demonstrating the behavior you expect from others", "Being perfect", "Avoiding all mistakes"], correctAnswer: 1 },
          { question: "How can a leader motivate others?", answers: ["Through fear and punishment", "By recognizing efforts and encouraging growth", "By promising rewards only", "By doing all the work themselves"], correctAnswer: 1 },
          { question: "What role does listening play in leadership?", answers: ["None, leaders should only speak", "It helps leaders understand needs and perspectives", "It shows weakness", "Only to find mistakes"], correctAnswer: 1 },
          { question: "What is a vision in leadership?", answers: ["A dream you have at night", "A clear picture of what you want to achieve", "Something only adults can have", "A rule that can never change"], correctAnswer: 1 },
          { question: "How do inclusive leaders treat team members?", answers: ["They value diversity and different perspectives", "They only listen to people like themselves", "They treat everyone exactly the same", "They avoid team members who disagree"], correctAnswer: 0 }
        ]
      },
      {
        title: "Study Skills",
        description: "Learn effective strategies for learning and academic success.",
        category: "Academic Development",
        difficulty: "Intermediate",
        questions: [
          { question: "What is active studying?", answers: ["Reading the same thing over and over", "Engaging with material through questions, summaries, and connections", "Studying while standing up", "Only studying the night before a test"], correctAnswer: 1 },
          { question: "Which is an effective study environment?", answers: ["A noisy room with lots of distractions", "While watching television", "A quiet, organized space with good lighting", "Only studying in bed"], correctAnswer: 2 },
          { question: "What is spaced repetition?", answers: ["Studying all at once before a test", "Reviewing material at increasing intervals over time", "Repeating everything in the same order", "Reading very quickly"], correctAnswer: 1 },
          { question: "How does taking breaks help with studying?", answers: ["It prevents mental fatigue and improves focus", "It doesn't help at all", "It makes studying take longer", "Only if breaks are several hours long"], correctAnswer: 0 },
          { question: "What is a study schedule?", answers: ["A plan for when and what to study", "A list of excuses for not studying", "Studying only when you feel like it", "Something only adults need"], correctAnswer: 0 },
          { question: "Which note-taking strategy helps organize information?", answers: ["Writing down every word", "Never taking notes", "Using outlines, mind maps, or charts", "Using only one color pen"], correctAnswer: 2 },
          { question: "What is the SQ3R method?", answers: ["A type of test", "Survey, Question, Read, Recite, Review reading strategy", "A way to avoid studying", "Something only teachers use"], correctAnswer: 1 },
          { question: "How can you improve your memory when studying?", answers: ["Only study things you already know", "Connect new information to things you already understand", "Memorize without understanding", "Study while very tired"], correctAnswer: 1 },
          { question: "What should you do if you don't understand something?", answers: ["Skip it entirely", "Pretend you understand", "Ask questions and seek help", "Give up on the subject"], correctAnswer: 2 },
          { question: "Which is better for long-term learning?", answers: ["Cramming the night before", "Regular study sessions over time", "Studying only what's easy", "Never reviewing material"], correctAnswer: 1 }
        ]
      },
      {
        title: "Honesty & Integrity",
        description: "Learn the importance of truthfulness and strong moral principles.",
        category: "Character Education",
        difficulty: "Beginner",
        questions: [
          { question: "What is honesty?", answers: ["Telling the truth", "Saying what others want to hear", "Keeping all secrets", "Only telling part of the truth"], correctAnswer: 0 },
          { question: "What does integrity mean?", answers: ["Being popular", "Doing the right thing even when no one is watching", "Following the crowd", "Only being good when others can see"], correctAnswer: 1 },
          { question: "Why is honesty important in friendships?", answers: ["It isn't important", "It builds trust", "So you can tell secrets", "To make friends like you"], correctAnswer: 1 },
          { question: "What should you do if you make a mistake?", answers: ["Blame someone else", "Hide it", "Take responsibility and try to fix it", "Make excuses"], correctAnswer: 2 },
          { question: "What does it mean to keep your word?", answers: ["Saying nice things", "Doing what you said you would do", "Making promises", "Avoiding difficult tasks"], correctAnswer: 1 },
          { question: "If you find something that doesn't belong to you, you should:", answers: ["Keep it", "Hide it", "Try to return it to the owner", "Give it to a friend"], correctAnswer: 2 },
          { question: "What is academic honesty?", answers: ["Getting help on all assignments", "Doing your own work and giving credit to others' ideas", "Getting the highest grades possible", "Helping friends during tests"], correctAnswer: 1 },
          { question: "Why is cheating wrong?", answers: ["Only if you get caught", "It isn't wrong", "It's dishonest and unfair to others", "Only in certain situations"], correctAnswer: 2 },
          { question: "How does being honest benefit you?", answers: ["People will trust and respect you", "It doesn't benefit you", "You'll never get in trouble", "You'll always get what you want"], correctAnswer: 0 },
          { question: "What is a white lie?", answers: ["A small lie that doesn't matter", "A lie told to be kind", "A lie told to avoid consequences", "The only acceptable type of lie"], correctAnswer: 1 }
        ]
      },
      {
        title: "Creativity & Innovation",
        description: "Learn to think outside the box and develop new ideas.",
        category: "Creative Thinking",
        difficulty: "Intermediate",
        questions: [
          { question: "What is creativity?", answers: ["Only for artists", "Being perfect at everything", "The ability to think of new and original ideas", "Following instructions exactly"], correctAnswer: 2 },
          { question: "How can you develop creativity?", answers: ["You can't, you're born with it", "By practicing and trying new approaches", "By doing the same thing repeatedly", "By copying others exactly"], correctAnswer: 1 },
          { question: "What is brainstorming?", answers: ["Thinking about weather", "Generating many ideas without judgment", "Planning carefully", "Finding the one right answer"], correctAnswer: 1 },
          { question: "What can limit creativity?", answers: ["Practice and experimentation", "Fear of making mistakes", "Learning new skills", "Asking questions"], correctAnswer: 1 },
          { question: "What is innovation?", answers: ["Doing things the way they've always been done", "Putting creative ideas into practice", "Only using technology", "Following rules exactly"], correctAnswer: 1 },
          { question: "How does asking 'what if' questions help creativity?", answers: ["It doesn't help", "It opens up new possibilities", "It focuses on limitations", "It avoids all problems"], correctAnswer: 1 },
          { question: "What role does curiosity play in creativity?", answers: ["It gets you in trouble", "It drives exploration and new ideas", "It should be discouraged", "It has no connection to creativity"], correctAnswer: 1 },
          { question: "How can collaboration enhance creativity?", answers: ["It limits individual ideas", "It brings together different perspectives", "It slows down the process", "It has no effect on creativity"], correctAnswer: 1 },
          { question: "What is divergent thinking?", answers: ["Thinking like everyone else", "Generating many possible solutions", "Finding the one right answer", "Avoiding all problems"], correctAnswer: 1 },
          { question: "What can inspire creativity?", answers: ["Only looking at others' work", "Nature, art, new experiences, and challenges", "Staying in your comfort zone", "Never changing your routine"], correctAnswer: 1 }
        ]
      },
      {
        title: "Conflict Resolution Advanced",
        description: "Learn advanced strategies for resolving difficult disagreements.",
        category: "Social Skills",
        difficulty: "Advanced",
        questions: [
          { question: "What is a win-win solution?", answers: ["When you get everything you want", "When someone loses and someone wins", "When both parties' needs are addressed", "When no one gets what they want"], correctAnswer: 2 },
          { question: "What does 'agreeing to disagree' mean?", answers: ["Continuing to argue", "Accepting different viewpoints without agreement", "Giving up completely", "Ignoring the conflict"], correctAnswer: 1 },
          { question: "What is perspective-taking in conflict resolution?", answers: ["Taking photos", "Understanding the situation from another's point of view", "Taking the best position", "Avoiding looking at the problem"], correctAnswer: 1 },
          { question: "How can reframing help in conflicts?", answers: ["By avoiding the issue", "By looking at the situation in a different way", "By blaming others", "By ignoring feelings"], correctAnswer: 1 },
          { question: "What is the difference between a position and an interest?", answers: ["They're the same thing", "Positions are what you demand; interests are why you want it", "Positions are more important", "Interests should be ignored"], correctAnswer: 1 },
          { question: "What does de-escalation mean?", answers: ["Making a conflict worse", "Calming a tense situation", "Avoiding all conflicts", "Winning an argument"], correctAnswer: 1 },
          { question: "What is active listening in conflict resolution?", answers: ["Waiting for your turn to speak", "Fully focusing on understanding the other person", "Preparing your response", "Ignoring what you don't agree with"], correctAnswer: 1 },
          { question: "When might a mediator be helpful?", answers: ["When one person wants to win", "When parties can't resolve the conflict themselves", "When there's no real problem", "When you need someone to take your side"], correctAnswer: 1 },
          { question: "What are boundaries in relationships?", answers: ["Walls that keep people apart", "Limits that define acceptable behavior", "Rules only one person sets", "Things that prevent closeness"], correctAnswer: 1 },
          { question: "What is the role of apology in conflict resolution?", answers: ["Showing weakness", "Acknowledging harm and taking responsibility", "Avoiding consequences", "Ending discussion quickly"], correctAnswer: 1 }
        ]
      },
      {
        title: "Financial Literacy",
        description: "Learn basic concepts about money management and saving.",
        category: "Life Skills",
        difficulty: "Intermediate",
        questions: [
          { question: "What is a budget?", answers: ["A type of wallet", "A plan for how to spend and save money", "A kind of bank", "A credit card"], correctAnswer: 1 },
          { question: "What is saving?", answers: ["Spending all your money", "Setting aside money for future needs", "Borrowing money", "Only for adults"], correctAnswer: 1 },
          { question: "What is the difference between needs and wants?", answers: ["They're the same thing", "Needs are essential for living; wants are nice but not necessary", "Wants are more important", "Needs are only for children"], correctAnswer: 1 },
          { question: "What is interest?", answers: ["Being interested in money", "Extra money paid for borrowing or earned from saving", "A type of coin", "The same as a loan"], correctAnswer: 1 },
          { question: "Why is it important to save money?", answers: ["It isn't important", "For emergencies and future goals", "Only to buy expensive things", "Only adults need to save"], correctAnswer: 1 },
          { question: "What is a financial goal?", answers: ["Having lots of money", "Something specific you're saving for", "Spending all your money", "Only for wealthy people"], correctAnswer: 1 },
          { question: "What does 'living within your means' mean?", answers: ["Being wealthy", "Spending less than you earn", "Borrowing money often", "Having the newest things"], correctAnswer: 1 },
          { question: "What is comparison shopping?", answers: ["Buying the most expensive item", "Looking at different prices before buying", "Only shopping at one store", "Buying everything on sale"], correctAnswer: 1 },
          { question: "What is a wise way to use money?", answers: ["Spending it all immediately", "Planning, saving, and making thoughtful choices", "Never spending any", "Only buying things on sale"], correctAnswer: 1 },
          { question: "Why should you track your spending?", answers: ["To make yourself feel bad", "To know where your money is going", "It's not important", "Only adults need to do this"], correctAnswer: 1 }
        ]
      },
      {
        title: "Environmental Awareness",
        description: "Learn about protecting our planet and sustainable practices.",
        category: "Science Education",
        difficulty: "Beginner",
        questions: [
          { question: "What is recycling?", answers: ["Throwing everything away", "Turning used materials into new products", "Using more resources", "Only for certain people"], correctAnswer: 1 },
          { question: "Why is conserving water important?", answers: ["It isn't important", "Water is a limited resource we all need", "Only in some countries", "Only during droughts"], correctAnswer: 1 },
          { question: "What is pollution?", answers: ["Clean air and water", "Harmful substances in the environment", "A type of plant", "Something that doesn't affect people"], correctAnswer: 1 },
          { question: "How can you reduce waste?", answers: ["Use disposable items", "Use reusable items and avoid excess packaging", "Buy more things", "Recycle everything"], correctAnswer: 1 },
          { question: "What does 'sustainable' mean?", answers: ["Using resources faster", "Using resources in a way that they can be continued in the future", "Only for businesses", "Very expensive"], correctAnswer: 1 },
          { question: "How does planting trees help the environment?", answers: ["It doesn't help", "Trees clean air, provide habitat, and prevent erosion", "Only in forests", "Only in cities"], correctAnswer: 1 },
          { question: "What is renewable energy?", answers: ["Energy that runs out quickly", "Energy from sources that naturally replenish, like sun and wind", "Only for rich countries", "The same as fossil fuels"], correctAnswer: 1 },
          { question: "How can you conserve energy at home?", answers: ["Leave lights on all the time", "Turn off lights and electronics when not using them", "Use more electricity", "It doesn't matter what you do"], correctAnswer: 1 },
          { question: "What is a carbon footprint?", answers: ["A footprint made with carbon", "The amount of carbon emissions caused by a person's activities", "Only relevant for adults", "Only important for scientists"], correctAnswer: 1 },
          { question: "How does reducing, reusing, and recycling help the environment?", answers: ["It doesn't help", "It saves resources and reduces waste and pollution", "Only recycling matters", "Only adults need to worry about this"], correctAnswer: 1 }
        ]
      },
      {
        title: "Digital Safety",
        description: "Learn to protect yourself and stay safe in the digital world.",
        category: "Technology Education",
        difficulty: "Intermediate",
        questions: [
          { question: "What is personal information that should be kept private online?", answers: ["Your favorite color", "Your full name, address, and phone number", "The movies you like", "Your hobbies"], correctAnswer: 1 },
          { question: "What is a strong password?", answers: ["Your name or birthday", "A mix of letters, numbers, and symbols that's hard to guess", "The same password for everything", "A very short word"], correctAnswer: 1 },
          { question: "What should you do if a stranger contacts you online?", answers: ["Share your personal information", "Tell them where you live", "Don't respond and tell a trusted adult", "Arrange to meet them"], correctAnswer: 2 },
          { question: "What is digital footprint?", answers: ["Footprints on your keyboard", "The record of everything you do online", "A computer virus", "Something that disappears quickly"], correctAnswer: 1 },
          { question: "Before posting something online, you should think about:", answers: ["How many likes you'll get", "Whether it could harm yourself or others now or in the future", "If it will make you famous", "If everyone will agree with you"], correctAnswer: 1 },
          { question: "What is phishing?", answers: ["A fishing game", "Attempts to trick you into revealing personal information", "Sending friendly messages", "A type of social media"], correctAnswer: 1 },
          { question: "How can you check if information online is reliable?", answers: ["If it has a lot of likes", "Check multiple trustworthy sources", "If it looks professional", "If a friend shared it"], correctAnswer: 1 },
          { question: "What does 'think before you click' mean?", answers: ["Click as quickly as possible", "Consider the safety and consequences before clicking links", "Only click colorful buttons", "Click on everything you see"], correctAnswer: 1 },
          { question: "What is two-factor authentication?", answers: ["Using two devices at once", "An extra layer of security beyond just a password", "Having two accounts", "Using two different browsers"], correctAnswer: 1 },
          { question: "What should you do if you see cyberbullying?", answers: ["Join in so you won't be targeted", "Ignore it completely", "Support the person being bullied and tell a trusted adult", "Share it with more people"], correctAnswer: 2 }
        ]
      },
      {
        title: "Time Management",
        description: "Learn to use your time effectively and avoid procrastination.",
        category: "Life Skills",
        difficulty: "Intermediate",
        questions: [
          { question: "What is time management?", answers: ["Spending time on only fun activities", "The process of planning and organizing how to divide your time", "Having lots of free time", "Only for adults"], correctAnswer: 1 },
          { question: "Why is it helpful to use a planner or calendar?", answers: ["It isn't helpful", "To track tasks, deadlines, and appointments", "Only for very busy people", "To make your backpack heavier"], correctAnswer: 1 },
          { question: "What is procrastination?", answers: ["Working ahead of schedule", "Delaying tasks that need to be done", "Excellent time management", "A time management strategy"], correctAnswer: 1 },
          { question: "What is a to-do list?", answers: ["A list of things you'll never do", "A written list of tasks that need to be completed", "A type of calendar", "Something only teachers use"], correctAnswer: 1 },
          { question: "How can you prioritize tasks?", answers: ["Do the easiest ones first", "Do the most important or urgent ones first", "Do whatever you feel like", "Avoid the difficult ones"], correctAnswer: 1 },
          { question: "What is a time waster?", answers: ["Taking breaks", "An activity that uses time but doesn't help you meet your goals", "Studying", "Exercise"], correctAnswer: 1 },
          { question: "How can breaking large tasks into smaller steps help?", answers: ["It makes the task take longer", "It makes tasks more manageable and less overwhelming", "It creates more work", "It has no benefits"], correctAnswer: 1 },
          { question: "What are the benefits of good time management?", answers: ["Having less free time", "Reduced stress and improved productivity", "Being busy all the time", "Never having fun"], correctAnswer: 1 },
          { question: "What is the Pomodoro Technique?", answers: ["A cooking method", "Working for focused intervals with short breaks", "Working without any breaks", "A type of calendar"], correctAnswer: 1 },
          { question: "What should you do if you have too many tasks and not enough time?", answers: ["Give up on everything", "Prioritize, delegate if possible, and be realistic about what you can accomplish", "Stay up all night to finish", "Only do the fun tasks"], correctAnswer: 1 }
        ]
      }
    ];

    try {
      setLoading(true);
      for (const lesson of sampleLessons) {
        await addDoc(collection(db, 'lessons'), lesson);
      }
      setMessage('Sample lessons added successfully!');
      await fetchLessons();
    } catch (error) {
      console.error('Error adding sample lessons:', error);
      setMessage('Error adding sample lessons: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const LessonForm = ({ lesson, onSave, onCancel, isNew = false }) => {
    const [formData, setFormData] = useState(lesson);

    const handleQuestionChange = (questionIndex, field, value) => {
      const updatedQuestions = [...formData.questions];
      if (field === 'answers') {
        updatedQuestions[questionIndex].answers = value;
      } else {
        updatedQuestions[questionIndex][field] = value;
      }
      setFormData({ ...formData, questions: updatedQuestions });
    };

    const addQuestion = () => {
      setFormData({
        ...formData,
        questions: [
          ...formData.questions,
          {
            question: '',
            answers: ['', '', '', ''],
            correctAnswer: 0
          }
        ]
      });
    };

    const removeQuestion = (index) => {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: updatedQuestions });
    };

    return (
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        border: '2px solid var(--primary-blue)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>
          {isNew ? 'Add New Lesson' : 'Edit Lesson'}
        </h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', height: '80px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category:</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Difficulty:</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <h4 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Questions:</h4>
        
        {formData.questions.map((question, questionIndex) => (
          <div key={questionIndex} style={{ 
            border: '1px solid #ddd', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            background: '#f9f9f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h5>Question {questionIndex + 1}</h5>
              {formData.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  style={{ background: 'var(--error-red)', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Question:</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Answers:</label>
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={question.correctAnswer === answerIndex}
                    onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', answerIndex)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...question.answers];
                      newAnswers[answerIndex] = e.target.value;
                      handleQuestionChange(questionIndex, 'answers', newAnswers);
                    }}
                    placeholder={`Answer ${answerIndex + 1}`}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          style={{ 
            background: 'var(--accent-blue)', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginRight: '1rem',
            marginBottom: '1rem'
          }}
        >
          Add Question
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => onSave(formData, isNew)}
            style={{ 
              background: 'var(--success-green)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {isNew ? 'Add Lesson' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            style={{ 
              background: '#ccc', 
              color: 'black', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h1>🔧 Admin Panel</h1>
        <p>Add, edit, and manage lesson content.</p>
      </div>

      {message && (
        <div style={{ 
          background: message.includes('Error') ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)',
          border: `1px solid ${message.includes('Error') ? 'var(--error-red)' : 'var(--success-green)'}`,
          color: message.includes('Error') ? 'var(--error-red)' : 'var(--success-green)',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={addSampleLessons}
          disabled={loading}
          style={{ 
            background: 'var(--warning-orange)', 
            color: 'white', 
            border: 'none', 
            padding: '1rem 2rem', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            marginRight: '1rem'
          }}
        >
          {loading ? 'Adding...' : 'Add Sample Lessons'}
        </button>
        
        <button
          onClick={() => setEditingLesson('new')}
          disabled={loading}
          style={{ 
            background: 'var(--primary-blue)', 
            color: 'white', 
            border: 'none', 
            padding: '1rem 2rem', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          Add New Lesson
        </button>
      </div>

      {editingLesson === 'new' && (
        <LessonForm
          lesson={newLesson}
          onSave={handleSaveLesson}
          onCancel={() => setEditingLesson(null)}
          isNew={true}
        />
      )}

      {editingLesson && editingLesson !== 'new' && (
        <LessonForm
          lesson={editingLesson}
          onSave={handleSaveLesson}
          onCancel={() => setEditingLesson(null)}
        />
      )}

      <h2 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Existing Lessons ({lessons.length})</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : lessons.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          background: '#f9f9f9', 
          borderRadius: '8px',
          border: '2px dashed #ccc'
        }}>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            No lessons found. Add some sample lessons to get started!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {lessons.map(lesson => (
            <div key={lesson.id} style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              border: '1px solid #ddd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
                    {lesson.title}
                  </h3>
                  <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    {lesson.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    <span>📚 {lesson.category}</span>
                    <span>📊 {lesson.difficulty}</span>
                    <span>❓ {lesson.questions?.length || 0} questions</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setEditingLesson(lesson)}
                    style={{ 
                      background: 'var(--accent-blue)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '4px', 
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    style={{ 
                      background: 'var(--error-red)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '4px', 
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {lesson.questions && lesson.questions.length > 0 && (
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--primary-blue)' }}>
                    View Questions ({lesson.questions.length})
                  </summary>
                  <div style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
                    {lesson.questions.map((question, index) => (
                      <div key={index} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                        <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                          {index + 1}. {question.question}
                        </p>
                        <ul style={{ marginLeft: '1rem' }}>
                          {question.answers?.map((answer, ansIndex) => (
                            <li 
                              key={ansIndex} 
                              style={{ 
                                color: ansIndex === question.correctAnswer ? 'var(--success-green)' : 'var(--text-light)',
                                fontWeight: ansIndex === question.correctAnswer ? '600' : 'normal'
                              }}
                            >
                              {answer} {ansIndex === question.correctAnswer && '✓'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugPage;
