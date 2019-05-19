module Main exposing (main)

import Browser
import Html exposing (Html, div, h2, i, p, text)
import Html.Attributes exposing (class)
import Http
import Json.Decode exposing (field, int, list, map2, map3, string)
import Set



-- Model


type alias Post =
    { userId : Int
    , title : String
    , body : String
    }


type alias User =
    { id : Int
    , name : String
    }


type alias Model =
    { posts : List Post
    , users : List User
    }



-- Msg


type Msg
    = RetrievedPosts (Result Http.Error (List Post))
    | RetrievedUser (Result Http.Error User)



-- HTTP


postsBase : String
postsBase =
    "https://jsonplaceholder.typicode.com"


getPosts : Cmd Msg
getPosts =
    let
        postDecoder =
            map3 Post
                (field "userId" int)
                (field "title" string)
                (field "body" string)

        postsDecoder =
            list postDecoder
    in
    Http.get
        { url = String.join "/" [ postsBase, "posts" ]
        , expect = Http.expectJson RetrievedPosts postsDecoder
        }


fetchUsers : List Int -> Cmd Msg
fetchUsers users =
    let
        userDecoder =
            map2 User
                (field "id" int)
                (field "name" string)

        fetchUser : Int -> Cmd Msg
        fetchUser userId =
            Http.get
                { url = String.join "/" [ postsBase, "users", String.fromInt userId ]
                , expect = Http.expectJson RetrievedUser userDecoder
                }
    in
    users
        |> List.map fetchUser
        |> Cmd.batch



-- Init


init : {} -> ( Model, Cmd Msg )
init _ =
    ( { posts = [], users = [] }
    , getPosts
    )



-- Update


newUsers : List User -> List Post -> List Int
newUsers previousUsers posts =
    let
        previousIds =
            previousUsers
                |> List.map (\user -> user.id)
                |> Set.fromList

        requiredIds =
            posts
                |> List.map (\post -> post.userId)
                |> Set.fromList
    in
    Set.diff requiredIds previousIds |> Set.toList


errorToString : Http.Error -> String
errorToString err =
    case err of
        Http.BadUrl text ->
            "BadUrl " ++ text

        Http.Timeout ->
            "Timeout"

        Http.NetworkError ->
            "NetworkError"

        Http.BadStatus val ->
            "Bad Status " ++ String.fromInt val

        Http.BadBody text ->
            "Bad body " ++ text


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RetrievedPosts result ->
            case result of
                Ok posts ->
                    ( { model | posts = posts }, fetchUsers <| newUsers model.users posts )

                Err err ->
                    ( Debug.log (errorToString err) model, Cmd.none )

        RetrievedUser result ->
            case result of
                Ok user ->
                    ( { model | users = model.users ++ [ user ] }, Cmd.none )

                Err err ->
                    ( Debug.log (errorToString err) model, Cmd.none )



-- View


getUserString : List User -> Int -> String
getUserString users id =
    users
        |> List.filter (\u -> u.id == id)
        |> List.map (\u -> u.name)
        |> List.head
        |> Maybe.withDefault (String.fromInt id)


viewPost : List User -> Post -> Html Msg
viewPost users post =
    div [ class "item" ]
        [ i [ class "large middle aligned icon user" ] []
        , div [ class "content" ]
            [ div [ class "description" ]
                [ h2 [] [ text post.title ]
                , p [] [ text post.body ]
                ]
            , div [ class "header" ] [ text <| getUserString users post.userId ]
            ]
        ]


view : Model -> Html Msg
view model =
    if List.isEmpty model.posts then
        div [] [ text "Posts" ]

    else
        div [ class "ui container" ]
            [ div [ class "ui relaxed divided list" ]
                (model.posts
                    |> List.map (viewPost model.users)
                )
            ]



-- Main


main : Program {} Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
