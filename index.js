const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users.routes');
const ageGroupRouter = require('./routes/ageGroup.routes');
const categoryRouter = require('./routes/category.routes');
const ordersRouter = require('./routes/orders.routes');
const programCubeRouter = require('./routes/programCube.routes')
const rolesRouter = require('./routes/roles.routes');
const scoresRouter = require('./routes/scores.routes');
const shopItemsRouter = require('./routes/shopItems.routes');
const statusRouter = require('./routes/status.routes');
const studyGroupRouter = require('./routes/studyGroup.routes');
const studyProgramRouter = require('./routes/studyProgram.routes');
const timesheetRouter = require('./routes/timesheet.routes');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json({ limit: '500mb' }));

app.use('/api', userRouter);
app.use('/api', ageGroupRouter);
app.use('/api', categoryRouter);
app.use('/api', ordersRouter);
app.use('/api', programCubeRouter);
app.use('/api', rolesRouter);
app.use('/api', scoresRouter);
app.use('/api', shopItemsRouter);
app.use('/api', statusRouter);
app.use('/api', studyGroupRouter);
app.use('/api', studyProgramRouter);
app.use('/api', timesheetRouter);

app.listen(PORT, () => console.log(`Сервер запущен с портом: ${PORT}`));