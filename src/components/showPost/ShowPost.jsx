import { Button, Card, Grid, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './showpost.css';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/system';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fakePost } from '../../dummyData/dummyData';


const ShowPost = () => {
    const [post, setPost] = useState(fakePost);
    const delatePost = (id) => {
        let filter = post.filter((elem) => {
            return elem.id !== id;
        })
        setPost(filter)
    }
    return (
        <div className='showpost commonBgStyle'>
            <h3 className='title'>Show Post</h3>
            <Box sx={{ display: 'flex' }}>
                <div className="search">
                    <input type="text" placeholder='Search Post' />
                    <SearchIcon className='searchIcon' />
                </div>
                <Link to="/admin/addpost"><Button variant="contained" sx={{ bgcolor: 'rgba(0, 0, 255, 0.803)' }}>Create</Button></Link>
            </Box>

            {/* --- post row start ---*/}
            <Grid container sx={{ my: 3 }}>
                {
                    post ? post.map((elem) => {
                        return (
                            <>
                                <Grid xl={3} md={4} sm={6} sx={{ my: 3 }} key={elem.id}>
                                    <Card sx={{ maxWidth: 345 }}>
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ bgcolor: '#4CB5F5' }} aria-label="recipe">
                                                    R
                                                </Avatar>
                                            }
                                            action={
                                                <IconButton aria-label="settings">
                                                    <MoreVertIcon />
                                                </IconButton>
                                            }
                                            title={elem?.author}
                                            subheader={elem?.category}
                                        />
                                        <CardMedia
                                            component="img"
                                            height="194"
                                            image={`${elem?.img}`}
                                            alt="Paella dish"
                                        />
                                        <CardContent>
                                            <h3 className='post-title'>{elem?.title}</h3>
                                            <Typography variant="body2" className='discription'>
                                                {elem?.discription}
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            <Link harf={`https://edition.cnn.com/europe/live-news/russia-ukraine-war-news-03-22-23/index.html`}><Button variant="contained" sx={{ bgcolor: '#4CB5F5' }} >Read More</Button></Link>
                                            <Button variant='contained' sx={{ bgcolor: 'red', ml: 'auto' }} onClick={() => delatePost(elem?.id)}>Delate</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            </>
                        )
                    })
                        :
                        'Post Not Found'
                }
            </Grid>
        </div>
    );
};

export default ShowPost;