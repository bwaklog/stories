import jwt from 'jsonwebtoken';
import config from '../config/config.mjs';
import connect from '../database/connect.mjs';
import { ObjectId } from 'mongodb';

function extractTokenFromHeader(header) {
    var type = header.split(' ')[0];
    var token = header.split(' ')[1];
    if (type !== 'Bearer') {
        return null;
    }
    if (!token) {
        return null;
    }
    return token;
}

// auth middleware
async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, config.jwt.jwtSecret);
        let author_id = decoded._id;
        let query = { _id: ObjectId.createFromHexString(author_id) };
        
        let collections = connect.db.collection('users');

        let user = await collections.findOne(query);
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        return null;
    }
}

export default { verifyToken, extractTokenFromHeader };