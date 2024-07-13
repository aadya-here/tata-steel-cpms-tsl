import React from "react";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Card from "@mui/joy/Card";
import { Stack, Typography } from "@mui/material";
import bg from "../assets/bg.png";

const Wrapper = styled("div")({
    backgroundImage: `url(${bg})`,
    backgroundColor: "#041643",
    backgroundPosition: "left center",
    backgroundRepeat: "repeat",
    backgroundSize: "cover",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    paddingTop: "1em",
    paddingBottom: '1em',

    "@media (min-width: 840px)": {
        height: "100vh",

    }

});

const CenteredContainer = styled("div")({
    display: "flex",
    maxWidth: "65%",
    width: "800px",
    marginInline: "auto",
    marginBottom: "2rem",
    padding: "1em",



    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "2rem",
    "@media (max-width: 840px)": {
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "90%",
        paddingTop: "2em",
        // paddingY: "3em"
    },
});

const CustomText = styled(Typography)({
    color: "white",
    fontWeight: "500",
    // fontSize: "2.4rem",
});

const CardContainer = styled(Card)({
    width: "400px",
    maxWidth: "100%",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "24px",
});

const FormContainer = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
});

const CommonAuth = ({ children }) => {
    const location = useLocation();

    const isSignUp = location.pathname === "/signup";

    return (
        <Wrapper>
            <CenteredContainer>
                <Stack>
                    <CustomText variant="h4" component="h2">
                        {isSignUp ? (
                            <>
                                {/* Create a <br /> */}
                                New account
                            </>
                        ) : (
                            <>
                                Login into
                                <br /> your account
                            </>
                        )}
                    </CustomText>
                    <CustomText variant="h3" component="h3"> CPMS</CustomText>
                    <CustomText variant="caption" > Contruction Project Management System</CustomText>


                </Stack>
                <CardContainer>
                    <FormContainer>{children}</FormContainer>
                </CardContainer>
            </CenteredContainer>
        </Wrapper>
    );
};

export default CommonAuth;
