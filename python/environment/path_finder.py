"""
Author: Joon Sung Park (joonspk@stanford.edu)
Modified version with swapped coordinates

File: path_finder.py
Description: Implements various path finding functions for generative agents.
Some of the functions are defunct. 
"""

import numpy as np


def print_maze(maze):
    for row in maze:
        for item in row:
            print(item, end="")
        print()


def path_finder_v1(maze, start, end, collision_block_char, verbose=False):
    def prepare_maze(maze, start, end):
        maze[start[0]][start[1]] = "S"
        maze[end[0]][end[1]] = "E"
        return maze

    def find_start(maze):
        for row in range(len(maze)):
            for col in range(len(maze[0])):
                if maze[row][col] == "S":
                    return row, col

    def is_valid_position(maze, pos_r, pos_c):
        if pos_r < 0 or pos_c < 0:
            return False
        if pos_r >= len(maze) or pos_c >= len(maze[0]):
            return False
        if maze[pos_r][pos_c] in " E":
            return True
        return False

    def solve_maze(maze, start, verbose=False):
        path = []
        stack = []
        stack.append(start)
        while len(stack) > 0:
            pos_r, pos_c = stack.pop()
            if verbose:
                print("Current position", pos_r, pos_c)
            if maze[pos_r][pos_c] == "E":
                path += [(pos_r, pos_c)]
                return path
            if maze[pos_r][pos_c] == "X":
                continue
            maze[pos_r][pos_c] = "X"
            path += [(pos_r, pos_c)]
            if is_valid_position(maze, pos_r - 1, pos_c):
                stack.append((pos_r - 1, pos_c))
            if is_valid_position(maze, pos_r + 1, pos_c):
                stack.append((pos_r + 1, pos_c))
            if is_valid_position(maze, pos_r, pos_c - 1):
                stack.append((pos_r, pos_c - 1))
            if is_valid_position(maze, pos_r, pos_c + 1):
                stack.append((pos_r, pos_c + 1))

            if verbose:
                print("Stack:", stack)
                print_maze(maze)

        return False

    # clean maze
    new_maze = []
    for row in maze:
        new_row = []
        for j in row:
            if j == collision_block_char:
                new_row += ["#"]
            else:
                new_row += [" "]
        new_maze += [new_row]

    maze = new_maze
    maze = prepare_maze(maze, start, end)
    start = find_start(maze)
    path = solve_maze(maze, start, verbose)
    return path


def path_finder_v2(a, start, end, collision_block_char, verbose=False):
    def make_step(m, k):
        for i in range(len(m)):
            for j in range(len(m[i])):
                if m[i][j] == k:
                    if i > 0 and m[i - 1][j] == 0 and a[i - 1][j] == 0:
                        m[i - 1][j] = k + 1
                    if j > 0 and m[i][j - 1] == 0 and a[i][j - 1] == 0:
                        m[i][j - 1] = k + 1
                    if i < len(m) - 1 and m[i + 1][j] == 0 and a[i + 1][j] == 0:
                        m[i + 1][j] = k + 1
                    if j < len(m[i]) - 1 and m[i][j + 1] == 0 and a[i][j + 1] == 0:
                        m[i][j + 1] = k + 1

    new_maze = []
    for row in a:
        new_row = []
        for j in row:
            if j == collision_block_char:
                new_row += [1]
            else:
                new_row += [0]
        new_maze += [new_row]
    a = new_maze

    m = []
    for i in range(len(a)):
        m.append([])
        for j in range(len(a[i])):
            m[-1].append(0)
    i, j = start
    m[i][j] = 1

    k = 0
    except_handle = 150
    while m[end[0]][end[1]] == 0:
        k += 1
        make_step(m, k)

        if except_handle == 0:
            break
        except_handle -= 1

    i, j = end
    k = m[i][j]
    the_path = [(i, j)]
    while k > 1:
        if i > 0 and m[i - 1][j] == k - 1:
            i, j = i - 1, j
            the_path.append((i, j))
            k -= 1
        elif j > 0 and m[i][j - 1] == k - 1:
            i, j = i, j - 1
            the_path.append((i, j))
            k -= 1
        elif i < len(m) - 1 and m[i + 1][j] == k - 1:
            i, j = i + 1, j
            the_path.append((i, j))
            k -= 1
        elif j < len(m[i]) - 1 and m[i][j + 1] == k - 1:
            i, j = i, j + 1
            the_path.append((i, j))
            k -= 1

    the_path.reverse()
    return the_path


# right now, the path_finder function is using path_finder_v2
def path_finder(maze, start, end, collision_block_char, verbose=False):
    """Find the shortest path from start to end in a given maze.

    Args:
        maze (List[List[str]]): 2D maze array where each element is a character.
        start (tuple): Starting coordinates in (y, x) format, where y is row and x is column.
        end (tuple): Ending coordinates in (y, x) format.
        collision_block_char (str): Character representing obstacles, defaults to '#'.
        verbose (bool, optional): Whether to print debug information. Defaults to False.

    Returns:
        List[tuple]: Returns path from start to end, where each element is a (y, x) coordinate.
        Returns empty list if no path is found.

    Example:
        >>> maze = [
        ...     ['#', '#', '#'],
        ...     [' ', ' ', ' '],
        ...     ['#', '#', '#']
        ... ]
        >>> start = (1, 0)  # row 1, column 0
        >>> end = (1, 2)    # row 1, column 2
        >>> path_finder(maze, start, end, '#')
        [(1, 0), (1, 1), (1, 2)]
    """
    path = path_finder_v2(maze, start, end, collision_block_char, verbose)
    return path


def closest_coordinate(curr_coordinate, target_coordinates):
    min_dist = None
    closest_coordinate = None
    for coordinate in target_coordinates:
        a = np.array(coordinate)
        b = np.array(curr_coordinate)
        dist = abs(np.linalg.norm(a - b))
        if not closest_coordinate:
            min_dist = dist
            closest_coordinate = coordinate
        else:
            if min_dist > dist:
                min_dist = dist
                closest_coordinate = coordinate
    return closest_coordinate


def path_finder_2(maze, start, end, collision_block_char, verbose=False):
    """Find the optimal path to reach near the target point.

    Instead of finding a direct path to the endpoint, this function finds a path to an
    accessible position around the endpoint. It checks the four adjacent positions
    (up, down, left, right) of the endpoint and chooses the one closest to the start.

    Args:
        maze (List[List[str]]): 2D maze array.
        start (tuple): Starting coordinates in (y, x) format.
        end (tuple): Target coordinates in (y, x) format.
        collision_block_char (str): Character representing obstacles.
        verbose (bool, optional): Whether to print debug information. Defaults to False.

    Returns:
        List[tuple]: Returns path from start to near target point, each element is a (y, x) coordinate.
        Returns empty list if no valid path is found.

    Example:
        >>> maze = [
        ...     ['#', '#', '#'],
        ...     [' ', ' ', ' '],
        ...     ['#', '#', '#']
        ... ]
        >>> start = (1, 0)
        >>> end = (1, 2)
        >>> path_finder_2(maze, start, end, '#')
        [(1, 0), (1, 1)]  # Reaches position near endpoint
    """
    start = list(start)
    end = list(end)

    t_top = (end[0], end[1] + 1)
    t_bottom = (end[0], end[1] - 1)
    t_left = (end[0] - 1, end[1])
    t_right = (end[0] + 1, end[1])
    pot_target_coordinates = [t_top, t_bottom, t_left, t_right]

    maze_height = len(maze)
    maze_width = len(maze[0])
    target_coordinates = []
    for coordinate in pot_target_coordinates:
        if (
            coordinate[0] >= 0
            and coordinate[0] < maze_height
            and coordinate[1] >= 0
            and coordinate[1] < maze_width
        ):
            target_coordinates += [coordinate]

    target_coordinate = closest_coordinate(start, target_coordinates)
    path = path_finder(
        maze, start, target_coordinate, collision_block_char, verbose=False
    )
    return path


def path_finder_3(maze, start, end, collision_block_char, verbose=False):
    """Find meeting paths between two points.

    This function first finds a complete path, then splits it in half, suitable for
    scenarios where two entities need to meet at a middle point. It returns two paths:
    one from start to middle, and another from end to middle.

    Args:
        maze (List[List[str]]): 2D maze array.
        start (tuple): Starting coordinates in (y, x) format.
        end (tuple): Ending coordinates in (y, x) format.
        collision_block_char (str): Character representing obstacles.
        verbose (bool, optional): Whether to print debug information. Defaults to False.

    Returns:
        tuple[List[tuple], List[tuple]] | List:
            If path exists and length > 2, returns tuple containing two paths:
            - First path (a_path): from start to middle point
            - Second path (b_path): from end to middle point (reversed)
            Returns empty list if path is too short or doesn't exist.

    Example:
        >>> maze = [
        ...     ['#', '#', '#', '#', '#'],
        ...     [' ', ' ', ' ', ' ', ' '],
        ...     ['#', '#', '#', '#', '#']
        ... ]
        >>> start = (1, 0)
        >>> end = (1, 4)
        >>> path_finder_3(maze, start, end, '#')
        ([(1, 0), (1, 1)], [(1, 4), (1, 3), (1, 2)])  # Two meeting paths
    """
    curr_path = path_finder(maze, start, end, collision_block_char, verbose=False)
    if len(curr_path) <= 2:
        return []
    else:
        a_path = curr_path[: int(len(curr_path) / 2)]
        b_path = curr_path[int(len(curr_path) / 2) - 1 :]
    b_path.reverse()
    return a_path, b_path


if __name__ == "__main__":
    maze = [
        ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
        [" ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"],
        ["#", " ", "#", " ", " ", "#", "#", " ", " ", " ", "#", " ", "#"],
        ["#", " ", "#", " ", " ", "#", "#", " ", "#", " ", "#", " ", "#"],
        ["#", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"],
        ["#", "#", "#", " ", "#", " ", "#", "#", "#", " ", "#", " ", "#"],
        ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " "],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ]

    start = (1, 0)  # 原来的 (0,1)
    end = (5, 5)  # 原来的 (0,1)
    print("Test 1:", path_finder(maze, start, end, "#"))

    start = (1, 0)  # 原来的 (0,1)
    end = (4, 11)  # 原来的 (11,4)
    print("Test 2:", path_finder_2(maze, start, end, "#"))

    start = (1, 0)  # 原来的 (0,1)
    end = (6, 12)  # 原来的 (12,6)
    result = path_finder_3(maze, start, end, "#")
    print("Test 3:", result)
    if result:
        print("Path A:", result[0])
        print("Path B:", result[1])
