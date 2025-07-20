const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'fail',
    code: 404,
    message: 'Not found',
    data: {},
  });
};
export default notFoundHandler;