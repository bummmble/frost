import cookieParser from 'cookie-parser';
import express from 'express';

export default server => {
  server.use(cookieParser());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};
