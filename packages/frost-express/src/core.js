import cookieParser from 'cookie-parser';
import express from 'express';

export default function createCore(server) {
  server.use(cookieParser());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
}
